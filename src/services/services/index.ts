"use server"

import { cacheLife, cacheTag } from "next/cache";
import { wordpressCachePolicy } from "@/lib/cache-policy";
import { toServiceCard, type ServiceCardData } from "@/lib/service-card";
import { wordpressJson, wordpressUrl } from "@/lib/wordpress";

export type ServiceProcessStep = {
    title: string;
    text: string;
    image?: string | null;
    image_width?: number;
    image_height?: number;
};

export type ServiceResponse = {
    slug: string;
    title: { rendered: string };
    content: { rendered: string };
    service_data?: {
        description?: string | null;
        image?: string | null;
        short_intro?: string | null;
        trust_indicators?: {
            heading: string;
            sub_heading: string;
        }[] | null;
        process_steps?: ServiceProcessStep[] | null;
    };
};

export const featuredServices = async (): Promise<ServiceResponse[]> => {
    "use cache";
    cacheLife(wordpressCachePolicy);
    cacheTag("wp:services");

    const params = new URLSearchParams({
        "services-categories": "118",
        per_page: "6",
        orderby: "date",
        order: "desc",
        _fields: "slug,title,content,service_data",
    });
    return wordpressJson<ServiceResponse[]>(wordpressUrl("service", params));
}

export const getAllServices = async (): Promise<ServiceResponse[]> => {
    "use cache";
    cacheLife(wordpressCachePolicy);
    cacheTag("wp:services");

    return wordpressJson<ServiceResponse[]>(wordpressUrl("service", new URLSearchParams({
        per_page: "100", _fields: "slug,title,content,service_data",
    })));
}

export const getServiceDetail = async (serviceSlug: string): Promise<ServiceResponse | null> => {
    "use cache";
    cacheLife(wordpressCachePolicy);
    cacheTag("wp:services", `wp:service:${serviceSlug}`);

    // This small dictionary is already requested by generateStaticParams and
    // the services page. Reuse it instead of issuing a request per prerender.
    return (await getAllServices()).find(service => service.slug === serviceSlug) ?? null;
}

export const getFeaturedServiceCards = async (): Promise<ServiceCardData[]> => {
    "use cache";
    cacheLife(wordpressCachePolicy);
    cacheTag("wp:services");
    return (await featuredServices()).map(toServiceCard);
};

export const getAllServiceCards = async (): Promise<ServiceCardData[]> => {
    "use cache";
    cacheLife(wordpressCachePolicy);
    cacheTag("wp:services");
    return (await getAllServices()).map(toServiceCard);
};
