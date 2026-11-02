"use server"

import { cacheLife } from "next/cache";
import { oneMonthCachePolicy } from "@/lib/cache-policy";
import { toServiceCard, type ServiceCardData } from "@/lib/service-card";

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
    cacheLife(oneMonthCachePolicy);

    const res = await fetch(`${process.env.NEXT_BASE_URL}/service?services-categories=118&per_page=6&orderby=date&order=desc`);
    if (!res.ok) {
        throw new Error("Failed to fetch featured services");
    }

    return res.json();
}

export const getAllServices = async (): Promise<ServiceResponse[]> => {
    "use cache";
    cacheLife(oneMonthCachePolicy);

    const res = await fetch(
        `${process.env.NEXT_BASE_URL}/service?per_page=100&_fields=slug,title,content,service_data`,
    );
    if (!res.ok) {
        throw new Error("Failed to fetch services");
    }

    return res.json();
}

export const getServiceDetail = async (serviceSlug: string): Promise<ServiceResponse | null> => {
    "use cache";
    cacheLife(oneMonthCachePolicy);

    const services = await getAllServices();
    return services.find((service) => service.slug === serviceSlug) ?? null;
}

export const getFeaturedServiceCards = async (): Promise<ServiceCardData[]> => {
    "use cache";
    cacheLife(oneMonthCachePolicy);
    return (await featuredServices()).map(toServiceCard);
};

export const getAllServiceCards = async (): Promise<ServiceCardData[]> => {
    "use cache";
    cacheLife(oneMonthCachePolicy);
    return (await getAllServices()).map(toServiceCard);
};
