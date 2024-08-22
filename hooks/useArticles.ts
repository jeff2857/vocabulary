import { getArticleList } from '@/utils/dbUtil';
import { useEffect, useState } from 'react';

export const useArticles = (refresh?: number) => {
	const [articles, setArticles] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);

	const getArticles = async () => {
		setLoading(true);
		const _articles = await getArticleList();
		setArticles(_articles);
		setLoading(false);
	};

	useEffect(() => {
		getArticles();
	}, [refresh]);

	return { articles, loading };
};
