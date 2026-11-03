<?php
/**
 * Plugin Name: Pro Developer Showcase Filters
 * Description: Public, published-post-only showcase taxonomy aggregation.
 * Version: 1.0.0
 *
 * Install as wp-content/mu-plugins/pro-developer-showcase-filters.php.
 * No credentials or private post data are returned. Counts are always scoped
 * to the selected custom post type, including shared taxonomies.
 */
defined('ABSPATH') || exit;

add_action('rest_api_init', static function () {
    register_rest_route('pro-developer/v1', '/showcase-filters', array(
        'methods' => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'args' => array(
            'kind' => array('required' => true, 'enum' => array('projects', 'demos')),
        ),
        'callback' => static function (WP_REST_Request $request) {
            global $wpdb;
            $kind = $request->get_param('kind');
            $rest_base = $kind === 'demos' ? 'd-showcase' : 'p-showcase';
            // A REST base is not necessarily the internal post-type key.
            $post_type = null;
            foreach (get_post_types(array('show_in_rest' => true), 'objects') as $type) {
                if (($type->rest_base ?: $type->name) === $rest_base) {
                    $post_type = $type->name;
                    break;
                }
            }
            if (!$post_type) {
                return new WP_Error('showcase_type_missing', 'Showcase type is not registered.', array('status' => 503));
            }
            $groups = array();
            $demo_tags = new stdClass();
            $taxonomies = array('industry-type', 'functionality');
            if ($kind === 'demos') $taxonomies[] = 'demo-tags';
            foreach ($taxonomies as $rest_taxonomy) {
                $taxonomy = null;
                foreach (get_object_taxonomies($post_type, 'objects') as $candidate) {
                    if (($candidate->rest_base ?: $candidate->name) === $rest_taxonomy) {
                        $taxonomy = $candidate->name;
                        break;
                    }
                }
                if (!$taxonomy) {
                    return new WP_Error('showcase_taxonomy_missing', 'Showcase taxonomy is not registered.', array('status' => 503));
                }
                $rows = $wpdb->get_results($wpdb->prepare(
                    "SELECT t.term_id AS id, t.name, t.slug, COUNT(DISTINCT p.ID) AS usage_count
                     FROM {$wpdb->terms} t
                     INNER JOIN {$wpdb->term_taxonomy} tt ON tt.term_id = t.term_id
                     INNER JOIN {$wpdb->term_relationships} tr ON tr.term_taxonomy_id = tt.term_taxonomy_id
                     INNER JOIN {$wpdb->posts} p ON p.ID = tr.object_id
                     WHERE tt.taxonomy = %s AND p.post_type = %s
                       AND p.post_status = 'publish'
                     GROUP BY t.term_id, t.name, t.slug ORDER BY t.name ASC",
                    $taxonomy, $post_type
                ));
                if ($wpdb->last_error) {
                    return new WP_Error('showcase_query_failed', 'Filters are temporarily unavailable.', array('status' => 503));
                }
                $options = array();
                foreach ($rows as $row) {
                    $label = html_entity_decode(wp_strip_all_tags($row->name), ENT_QUOTES, 'UTF-8');
                    $options[] = array('id' => (int) $row->id, 'label' => $label,
                        'slug' => $row->slug, 'count' => (int) $row->usage_count);
                    if ($rest_taxonomy === 'demo-tags') $demo_tags->{(string) $row->id} = $label;
                }
                if ($rest_taxonomy !== 'demo-tags') {
                    $groups[] = array('taxonomy' => $rest_taxonomy,
                        'name' => $rest_taxonomy === 'functionality' ? 'Functionality' : ($kind === 'demos' ? 'Industry Type' : 'Industry'),
                        'options' => $options);
                }
            }
            // Next.js owns the 60-second cache and webhook invalidation. Avoid a
            // second WordPress transient that could outlive that invalidation.
            $response = new WP_REST_Response(array('groups' => $groups,
                'demoTagNames' => $demo_tags, 'countsAvailable' => true));
            $response->header('Cache-Control', 'no-store');
            return $response;
        },
    ));
});
