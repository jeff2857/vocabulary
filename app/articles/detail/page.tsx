'use client';

import { AnswerRow } from '@/components/AnswerRow';
import { getWords } from '@/utils/dbUtil';
import {
	Button,
	FormControl,
	FormControlLabel,
	FormGroup,
	Skeleton,
	Switch,
	TextField,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const DetailPage = () => {
	const searchParams = useSearchParams();

	const [words, setWords] = useState<string[]>([]);
	const [article, setArticle] = useState('');
	const [showWord, setShowWord] = useState(false);
	const [showTranslation, setShowTranslation] = useState(false);
	const [showResult, setShowResult] = useState(false);
	const [inputIndex, setInputIndex] = useState(0);

	const getDefaultWords = async () => {
		const article = searchParams.get('article');
		if (!article) return;
		setArticle(article);
		const words = await getWords(article);
		setWords(words.split('\n'));
	};

	const onSubmit = () => {
		setShowWord(true);
		setShowResult(true);
	};

	useEffect(() => {
		getDefaultWords();
	}, [searchParams]);

	return (
		<div className="flex flex-col items-center py-10">
			<div>{article}</div>

			<div className="w-[50rem] mt-8">
				<div className="flex justify-end gap-2">
					<FormGroup>
						<FormControlLabel
							control={
								<Switch
									checked={showWord}
									onChange={(e) => setShowWord(e.target.checked)}
								/>
							}
							label="Show Word"
						/>
					</FormGroup>
					{/* <FormGroup>
						<FormControlLabel
							control={
								<Switch
									checked={showTranslation}
									onChange={(e) => setShowTranslation(e.target.checked)}
								/>
							}
							label="Show Translation"
						/>
					</FormGroup> */}
				</div>
			</div>

			<div className="mt-8 border-solid border border-c3 rounded-md">
				<div className="flex items-center px-4 py-2">
					<div className="w-[8rem]">Index</div>
					<div className="w-[10rem]">Word</div>
					<div className="w-[12rem]">Translation</div>
					<div className="w-[22rem]">Your Answer</div>
				</div>

				<div className="mt-2">
					{words.map((word, index) => (
						<AnswerRow
							key={index}
							word={word}
							index={index}
							showResult={showResult}
							showTranslation={showTranslation}
							showWord={showWord}
							inputIndex={inputIndex}
							onNextInput={(focusCurrent) =>
								setInputIndex((prev) => {
									return focusCurrent ? index : prev + 1;
								})
							}
						/>
					))}
				</div>
			</div>

			<div className="mt-8 flex items-center justify-end w-[50rem]">
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								checked={showResult}
								onChange={(e) => setShowResult(e.target.checked)}
							/>
						}
						label="Show Result"
					/>
				</FormGroup>
			</div>
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
