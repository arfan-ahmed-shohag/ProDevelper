"use server"

import { cacheLife } from "next/cache";

export type ServiceProcessStep = {
    title: string;
    text: string;
    image?: string | null;
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
    cacheLife({ stale: 60, revalidate: 60, expire: 2678400 });

    const res = await fetch(`${process.env.NEXT_BASE_URL}/service?services-categories=118&per_page=6&orderby=date&order=desc`);
    if (!res.ok) {
        throw new Error("Failed to fetch featured services");
    }

    return res.json();
}

export const getAllServices = async (): Promise<ServiceResponse[]> => {
    "use cache";
    cacheLife({ stale: 60, revalidate: 60, expire: 2678400 });

    const res = await fetch(`${process.env.NEXT_BASE_URL}/service?per_page=100`);
    if (!res.ok) {
        throw new Error("Failed to fetch services");
    }

    return res.json();
}

export const getServiceDetail = async (serviceSlug: string): Promise<ServiceResponse | null> => {
    "use cache";
    cacheLife({ stale: 60, revalidate: 60, expire: 2678400 });

    const res = await fetch(`${process.env.NEXT_BASE_URL}/service?slug=${encodeURIComponent(serviceSlug)}`);
    if (!res.ok) {
        throw new Error("Failed to fetch service details");
    }

    const services: ServiceResponse[] = await res.json();
    return services[0] ?? null;
}
