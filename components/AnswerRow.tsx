import { Skeleton, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
	index: number;
	word: string;
	showWord: boolean;
	showTranslation: boolean;
	showResult: boolean;
	inputIndex: number;
	onNextInput: (focusCurrent?: boolean) => void;
}

export const AnswerRow = ({
	showWord,
	showTranslation,
	showResult,
	index,
	word,
	inputIndex,
	onNextInput,
}: Props) => {
	const [answer, setAnswer] = useState('');
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

	return (
		<div
			className="flex items-center py-2 px-4"
			style={{
				backgroundColor: showResult
					? word === answer
						? '#BEDC74'
						: '#F0A8D0'
					: '#eee',
			}}
		>
			<div className="w-[8rem]">{index + 1}</div>
			<div className="w-[10rem]">
				{showRowWord || showWord ? (
					word
				) : (
					<div className="cursor-pointer" onClick={() => setShowRowWord(true)}>
						<Skeleton height={40} width="8rem" animation={false} />
					</div>
				)}
			</div>
			<div
				className="w-[12rem] cursor-pointer"
				onClick={() => setShowRowTranslation((prev) => !prev)}
			>
				{showRowTranslation || showTranslation ? (
					trans
				) : (
					<div>
						<Skeleton height={40} width="8rem" animation={false} />
					</div>
				)}
			</div>
			<div className="w-[22rem]">
				<TextField
					value={answer}
					onChange={(e) => setAnswer(e.target.value)}
					fullWidth
					size="small"
					// focused={inputIndex === index}
					// onFocus={() => onNextInput(true)}
					// onKeyUp={(k) => {
					// 	if (k.key === 'Enter') {
					// 		onNextInput();
					// 	}
					// }}
				/>
			</div>
		</div>
	);
};
