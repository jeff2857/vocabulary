'use client';

import { useArticles } from '@/hooks/useArticles';
import { delArticle } from '@/utils/dbUtil';
import { Add, Delete, Edit } from '@mui/icons-material';
import {
	Box,
	Button,
	IconButton,
	Modal,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
	const router = useRouter();

	const { articles, loading } = useArticles();

	const [delModalOpen, setDelModalOpen] = useState(false);
	const [curArticle, setCurArticle] = useState('');

	const goAdd = () => {
		router.push('/articles/add');
	};

	const goEdit = (article: string) => {
		router.push(`/articles/add?article=${article}`);
	};

	const goDetail = (article: string) => {
		router.push(`/articles/detail?article=${article}`);
	};

	const goDel = async (article: string) => {
		await delArticle(article);
	};

	return (
		<div className="flex flex-col items-center py-10">
			<div className="flex justify-between items-center w-[40rem]">
				<div>Article List</div>
				<div>
					<IconButton color="primary" onClick={goAdd}>
						<Add />
					</IconButton>
				</div>
			</div>

			<div className="mt-8 border-solid border border-c3 rounded-md">
				<Table className="min-w-[40rem]">
					<TableHead>
						<TableRow>
							<TableCell>Article</TableCell>
							<TableCell align="right">Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{articles &&
							articles.map((article) => (
								<TableRow key={article}>
									<TableCell
										className="cursor-pointer"
										onClick={() => goDetail(article)}
									>
										{article}
									</TableCell>
									<TableCell align="right">
										<div>
											<IconButton
												size="small"
												color="info"
												onClick={() => goEdit(article)}
											>
												<Edit />
											</IconButton>
											<IconButton
												size="small"
												color="error"
												onClick={() => {
													setCurArticle(article);
													setDelModalOpen(true);
												}}
											>
												<Delete />
											</IconButton>
										</div>
									</TableCell>
								</TableRow>
							))}

						{loading && (
							<TableRow>
								<TableCell colSpan={2}>
									<Skeleton height={20} />
									<Skeleton height={20} />
									<Skeleton height={20} />
								</TableCell>
							</TableRow>
						)}

						{!loading && !articles && (
							<TableRow>
								<TableCell>Empty</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<Modal open={delModalOpen} onClose={() => setDelModalOpen(false)}>
				<Box
					sx={{
						position: 'absolute',
						top: '40%',
						left: '50%',
						transform: 'translate(-50%,-50%)',
						width: 400,
						p: 4,
						bgcolor: '#eee',
						borderRadius: 2,
						boxShadow: 24,
					}}
				>
					<div className="">Delete article: {curArticle}?</div>
					<div className="mt-8 flex justify-end gap-4">
						<Button size="small" onClick={() => setDelModalOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="contained"
							size="small"
							onClick={() => goDel(curArticle)}
						>
							Confirm
						</Button>
					</div>
				</Box>
			</Modal>
		</div>
	);
}
