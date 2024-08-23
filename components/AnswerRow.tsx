import { Skeleton, TextField } from '@mui/material';
import { MutableRefObject, useEffect, useState } from 'react';

interface Props {
	index: number;
	word: string;
	showWord: boolean;
	showResult: boolean;
	showAnswer1: boolean;
	showAnswer2: boolean;
	showAnswer3: boolean;
	wrongWordIndexRef: MutableRefObject<number[]>;
}

export const AnswerRow = ({
	showWord,
	showResult,
	index,
	word,
	showAnswer1,
	showAnswer2,
	showAnswer3,
	wrongWordIndexRef,
}: Props) => {
	const [answer, setAnswer] = useState('');
	const [answer2, setAnswer2] = useState('');
	const [answer3, setAnswer3] = useState('');
	const [showRowWord, setShowRowWord] = useState(false);
	const [showRowTranslation, setShowRowTranslation] = useState(false);
	const [trans, setTrans] = useState('');

	const fetchTranslation = async () => {
		const res = await fetch(`${window.origin}/api/translate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ word }),
		});
		const { dst } = await res.json();
		if (dst) {
			setTrans(dst);
		}
	};

	useEffect(() => {
		setShowRowWord(false);
	}, [showWord]);

	useEffect(() => {
		if (showRowTranslation && !trans) {
			fetchTranslation();
		}
	}, [showRowTranslation, trans]);

	useEffect(() => {
		if (!showResult) return;
		if (showAnswer1 && word !== answer) {
			wrongWordIndexRef.current.push(index);
		}
		if (showAnswer2 && word !== answer2) {
			wrongWordIndexRef.current.push(index);
		}
		if (showAnswer3 && word !== answer3) {
			wrongWordIndexRef.current.push(index);
		}
	}, [showResult]);

	return (
		<div className="flex items-center py-2 px-4">
			<div className="w-[6rem]">{index + 1}</div>
			<div className="w-[11rem]">
				{showRowWord || showWord ? (
					word
				) : (
					<div className="cursor-pointer" onClick={() => setShowRowWord(true)}>
						<Skeleton height={40} width="8rem" animation={false} />
					</div>
				)}
			</div>
			<div
				className="w-[13rem] cursor-pointer"
				onClick={() => setShowRowTranslation((prev) => !prev)}
			>
				{showRowTranslation ? (
					trans
				) : (
					<div>
						<Skeleton height={40} width="8rem" animation={false} />
					</div>
				)}
			</div>
			<div className="w-[18rem]">
				{showAnswer1 ? (
					<TextField
						value={answer}
						onChange={(e) => setAnswer(e.target.value)}
						fullWidth
						size="small"
						style={{
							backgroundColor: showResult
								? word === answer
									? '#BEDC74'
									: '#F0A8D0'
								: '#eee',
						}}
					/>
				) : (
					<Skeleton height={40} width="12rem" animation={false} />
				)}
			</div>
			<div className="w-[18rem] ml-2">
				{showAnswer2 ? (
					<TextField
						value={answer2}
						onChange={(e) => setAnswer2(e.target.value)}
						fullWidth
						size="small"
						style={{
							backgroundColor: showResult
								? word === answer2
									? '#BEDC74'
									: '#F0A8D0'
								: '#eee',
						}}
					/>
				) : (
					<Skeleton height={40} width="12rem" animation={false} />
				)}
			</div>
			<div className="w-[18rem] ml-2">
				{showAnswer3 ? (
					<TextField
						value={answer3}
						onChange={(e) => setAnswer3(e.target.value)}
						fullWidth
						size="small"
						style={{
							backgroundColor: showResult
								? word === answer3
									? '#BEDC74'
									: '#F0A8D0'
								: '#eee',
						}}
					/>
				) : (
					<Skeleton height={40} width="12rem" animation={false} />
				)}
			</div>
		</div>
	);
};
