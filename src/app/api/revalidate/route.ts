import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";

type ContentType =
  | "service"
  | "p-showcase"
  | "d-showcase"
  | "c-feedback"
  | "industry-type"
  | "functionality"
  | "demo-tags"
  | "project-categories"
  | "post"
  | "category";

const invalidation: Record<ContentType, { tags: string[]; paths: string[] }> = {
  post: {
    tags: ["wp:blog:posts", "wp:blog:categories"],
    paths: ["/blog", "/blog/[slug]"],
  },
  category: {
    tags: ["wp:blog:posts", "wp:blog:categories"],
    paths: ["/blog", "/blog/[slug]"],
  },
  service: {
    tags: ["wp:services", "wp:home"],
    paths: ["/", "/services", "/services/[serviceName]"],
  },
  "p-showcase": {
    tags: ["wp:showcase:projects", "wp:showcase:projects:filters", "wp:home:featured-projects", "wp:home"],
    paths: ["/", "/project-showcase", "/services/[serviceName]"],
  },
  "d-showcase": {
    tags: ["wp:showcase:demos", "wp:showcase:demos:filters"],
    paths: ["/demo-showcase"],
  },
  "c-feedback": {
    tags: ["wp:feedback", "wp:home:feedback", "wp:home"],
    paths: ["/", "/about-us", "/services", "/services/[serviceName]", "/client-feedback"],
  },
  "industry-type": {
    tags: ["wp:showcase:projects", "wp:showcase:projects:filters", "wp:showcase:demos", "wp:showcase:demos:filters"],
    paths: ["/project-showcase", "/demo-showcase"],
  },
  functionality: {
    tags: ["wp:showcase:projects", "wp:showcase:projects:filters", "wp:showcase:demos", "wp:showcase:demos:filters"],
    paths: ["/project-showcase", "/demo-showcase"],
  },
  "demo-tags": {
    tags: ["wp:showcase:demos", "wp:showcase:demos:filters"],
    paths: ["/demo-showcase"],
  },
  "project-categories": {
    tags: ["wp:showcase:projects", "wp:showcase:projects:filters", "wp:home:featured-projects", "wp:home"],
    paths: ["/", "/project-showcase", "/services/[serviceName]"],
  },
};

const contentAliases: Record<string, ContentType> = {
  post: "post",
  posts: "post",
  category: "category",
  categories: "category",
  service: "service",
  "p-showcase": "p-showcase",
  "project-showcase": "p-showcase",
  "d-showcase": "d-showcase",
  "demo-showcase": "d-showcase",
  "c-feedback": "c-feedback",
  "industry-type": "industry-type",
  functionality: "functionality",
  "demo-tags": "demo-tags",
  "project-categories": "project-categories",
};

function matchesSecret(request: Request, secret: string) {
  const authorization = request.headers.get("authorization") ?? "";
  const supplied = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  const expectedBytes = Buffer.from(secret);
  const suppliedBytes = Buffer.from(supplied);
  return (
    suppliedBytes.length === expectedBytes.length &&
    timingSafeEqual(suppliedBytes, expectedBytes)
  );
}

export async function POST(request: Request) {
  const secret = process.env.WORDPRESS_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ error: "Revalidation is not configured" }, { status: 503 });
  }
  if (!matchesSecret(request, secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 4096) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }

  let payload: { post_type?: unknown; type?: unknown; taxonomy?: unknown };
  try {
    const body = await request.text();
    if (Buffer.byteLength(body) > 4096) {
      return Response.json({ error: "Payload too large" }, { status: 413 });
    }
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
    }
    payload = parsed as typeof payload;
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const candidate = payload.post_type ?? payload.taxonomy ?? payload.type;
  if (
    typeof candidate !== "string" ||
    !Object.hasOwn(contentAliases, candidate)
  ) {
    return Response.json({ error: "Unsupported content type" }, { status: 400 });
  }

  const type = contentAliases[candidate];
  const config = invalidation[type];
  for (const tag of config.tags) revalidateTag(tag, "max");
  for (const path of config.paths) {
    revalidatePath(path, path.includes("[") ? "page" : undefined);
  }

  return Response.json({ revalidated: true, contentType: type });
}
