import NewsList from "@/app/_components/NewsList";
import Pagination from "@/app/_components/Pagination";
import { NEWS_LIST_LIMIT } from "@/app/_contents";
import { getCategoryDetail, getNewsList } from "@/app/_libs/microcms";
import { notFound } from "next/navigation";

type Props = {
    params: {
        id: string;
        current: string;
    }
}

export default async function Page({ params }: Props) {
    const { current } = await params;
    const page = parseInt(current, 10);
    if (Number.isNaN(page) || page < 1) {
        notFound();
    }

    const { id } = await params;
    const category = await getCategoryDetail(id).catch(notFound);

    const { contents: news, totalCount } = await getNewsList({
        filters: `category[equals]${category.id}`,
        limit: NEWS_LIST_LIMIT,
        offset: NEWS_LIST_LIMIT * (page - 1)
    });

    if (news.length === 0) {
        notFound();
    }

    return (
        <>
            <NewsList news={news} />
            <Pagination totalCount={totalCount} current={page} basePath={`/news/category/${category.id}`} />
        </>
    )
}