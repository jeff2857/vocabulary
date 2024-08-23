export const formatArticleName = (name: string) => {
	const names = name.split(':');
	if (names.length <= 1) return name;
	names.splice(names.length - 1);
	return names.join(':');
};

export const getArticleNameTs = (name: string) => {
	const names = name.split(':');
	if (names.length <= 1) return '';
	return names[names.length - 1];
};
