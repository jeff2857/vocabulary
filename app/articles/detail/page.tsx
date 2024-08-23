'use client';

import { AnswerRow } from '@/components/AnswerRow';
import { formatArticleName } from '@/utils/articleUtil';
import { addArticle, getWords } from '@/utils/dbUtil';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Button,
	FormControl,
	FormControlLabel,
	FormGroup,
	IconButton,
	Skeleton,
	Snackbar,
	Switch,
	TextField,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

const DetailPage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [words, setWords] = useState<string[]>([]);
	const [article, setArticle] = useState('');
	const [showWord, setShowWord] = useState(false);
	const [showResult, setShowResult] = useState(false);
	const [showAnswer1, setShowAnswer1] = useState(true);
	const [showAnswer2, setShowAnswer2] = useState(false);
	const [showAnswer3, setShowAnswer3] = useState(false);
	const [saveWrongLoading, setSaveWrongLoading] = useState(false);
	const [snackOpen, setSnackOpen] = useState(false);
	const [snackMsg, setSnackMsg] = useState('');

	const wrongWordIndexRef = useRef<number[]>([]);

	const getDefaultWords = async () => {
		const article = searchParams.get('article');
		if (!article) return;
		setArticle(article);
		const words = await getWords(article);
		setWords(words.split('\n'));
	};

	const onSubmit = (e: any) => {
		if (e.target.checked) {
			setShowWord(true);
			setShowResult(true);
		} else {
			setShowWord(false);
			setShowResult(false);
		}
	};

	const createWrongWordsList = async () => {
		const wrongWords = words.filter((_, idx) =>
			wrongWordIndexRef.current.includes(idx)
		);
		const now = new Date();
		const articleName = `${formatArticleName(article)}-Wrong:${now.valueOf()}`;
		setSaveWrongLoading(true);
		try {
			await addArticle(articleName, wrongWords.join('\n'));
			router.push('/');
		} catch (err: any) {
			setSnackMsg((err as Error).message);
			setSnackOpen(true);
		} finally {
			setSaveWrongLoading(false);
		}
	};

	useEffect(() => {
		getDefaultWords();
	}, [searchParams]);

	useEffect(() => {
		if (!showResult) {
			wrongWordIndexRef.current = [];
		}
	}, [showResult]);

	return (
		<div className="flex flex-col items-center py-10">
			<div>{formatArticleName(article)}</div>

			<div className="mt-8 border-solid border border-c3 rounded-md">
				<div className="flex items-center px-4 py-2">
					<div className="w-[6rem]">Index</div>
					<div className="w-[11rem]">
						Word
						<IconButton onClick={() => setShowWord((prev) => !prev)}>
							{showWord ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</div>
					<div className="w-[13rem]">Translation</div>
					<div className="w-[18rem] flex items-center gap-1">
						Your Answer 1
						<IconButton onClick={() => setShowAnswer1((prev) => !prev)}>
							{showAnswer1 ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</div>
					<div className="w-[18rem] flex items-center gap-1">
						Your Answer 2
						<IconButton onClick={() => setShowAnswer2((prev) => !prev)}>
							{showAnswer2 ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</div>
					<div className="w-[18rem] flex items-center gap-1">
						Your Answer 3
						<IconButton onClick={() => setShowAnswer3((prev) => !prev)}>
							{showAnswer3 ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</div>
				</div>

				<div className="mt-2">
					{words.map((word, index) => (
						<AnswerRow
							key={index}
							word={word}
							index={index}
							showResult={showResult}
							showWord={showWord}
							showAnswer1={showAnswer1}
							showAnswer2={showAnswer2}
							showAnswer3={showAnswer3}
							wrongWordIndexRef={wrongWordIndexRef}
						/>
					))}
				</div>
			</div>

			<div className="mt-8 flex items-center justify-end w-[50rem] gap-8">
				{showResult && (
					<div className="">
						<Button
							variant="contained"
							size="small"
							onClick={createWrongWordsList}
							disabled={!showAnswer1 && !showAnswer2 && !showAnswer3}
						>
							新建错误单词表
						</Button>
					</div>
				)}

				<FormGroup>
					<FormControlLabel
						control={<Switch checked={showResult} onChange={onSubmit} />}
						label="Show Result"
					/>
				</FormGroup>
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

const Default = () => {
	return (
		<Suspense>
			<DetailPage />
		</Suspense>
	);
};

export default Default;
