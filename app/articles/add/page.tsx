'use client';

import { addArticle, getWords } from '@/utils/dbUtil';
import { TextField, Button, Snackbar } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const AddArticlePage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [articleName, setArticleName] = useState(
		searchParams.get('article') || ''
	);
	const [words, setWords] = useState('');
	const [snackOpen, setSnackOpen] = useState(false);
	const [snackMsg, setSnackMsg] = useState('');
	const [saveLoading, setSaveLoading] = useState(false);

	const addDisabled = useMemo(() => {
		return !articleName || saveLoading;
	}, [articleName, saveLoading]);

	const saveArticle = async () => {
		setSaveLoading(true);
		try {
			await addArticle(articleName, words);
			router.push('/');
		} catch (err: any) {
			setSnackMsg((err as Error).message);
			setSnackOpen(true);
		} finally {
			setSaveLoading(false);
		}
	};

	const getDefaultWords = async () => {
		const article = searchParams.get('article');
		if (!article) return;
		const words = await getWords(article);
		setWords(words);
	};

	useEffect(() => {
		getDefaultWords();
	}, [searchParams]);

	return (
		<div className="flex flex-col items-center py-12">
			<div className="font-bold text-2xl">
				{searchParams.get('article') ? 'Edit' : 'Add'} Article
			</div>

			<div className="mt-8">
				<TextField
					label="Article Name"
					className="w-80"
					required
					// sx={{
					// 	'& .MuiInputBase-root': {
					// 		color: '#eee',
					// 	},
					// 	'& .MuiInputLabel-root': {
					// 		color: '#eeeeee80',
					// 	},
					// 	'& .MuiOutlinedInput-input': {
					// 		color: '#eee',
					// 	},
					// 	'& .MuiOutlinedInput-notchedOutline': {
					// 		borderColor: '#76ABAE',
					// 	},
					// }}
					value={articleName}
					onChange={(e) => setArticleName(e.target.value)}
				/>
			</div>

			<div className="mt-8">
				<TextField
					multiline
					label="Input Words"
					className="w-80"
					value={words}
					onChange={(e) => setWords(e.target.value)}
					// sx={{
					// 	'& .MuiInputBase-root': {
					// 		color: '#eee',
					// 	},
					// 	'& .MuiInputLabel-root': {
					// 		color: '#eee',
					// 	},
					// 	'& .MuiOutlinedInput-input': {
					// 		color: '#eee',
					// 	},
					// 	'& .MuiOutlinedInput-notchedOutline': {
					// 		borderColor: '#76ABAE',
					// 	},
					// }}
				/>
			</div>

			<div className="mt-8">
				<Button
					variant="contained"
					disabled={addDisabled}
					onClick={saveArticle}
				>
					{saveLoading ? 'Saving' : 'Save'}
				</Button>
			</div>

			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={snackOpen}
				onClose={() => setSnackOpen(false)}
				message={snackMsg}
				autoHideDuration={3000}
			/>
		</div>
	);
};

export default AddArticlePage;
