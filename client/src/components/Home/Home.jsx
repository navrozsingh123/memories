import { useState, useEffect, useCallback } from 'react'
import { Container, Grow, Box, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getPosts } from '../../actions/posts';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import Paginate from '../Pagination/Paginate';

function Home() {
    const [currentId, setCurrentId] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { currentPage, numberOfPages, isLoading, error } = useSelector((state) => state.posts);

    const page = Number(searchParams.get('page')) || 1;

    const load = useCallback(() => dispatch(getPosts(page)), [dispatch, page]);

    useEffect(() => { load(); }, [load]);

    // Creating a memory can push it onto a different page, so go back to the
    // first page and refetch rather than guessing where it landed.
    const handleCreated = () => {
        if (page !== 1) setSearchParams({ page: '1' });
        else load();
    };

    // A delete leaves the page short by one, so pull the page again to backfill.
    const handleDeleted = () => { load(); };

    return (
        <Grow in>
            <Container>
                {/* One grid holds the form and every card. The form is pinned to the
                    top of the last column and the cards auto-fill everything else,
                    so they wrap underneath it rather than leaving the column empty. */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                        },
                        gap: 3,
                        alignItems: 'stretch',
                    }}
                >
                    <Box
                        sx={{
                            gridColumn: { sm: '-2 / -1' },
                            gridRow: { sm: '1' },
                            alignSelf: 'start',
                        }}
                    >
                        <Form
                            key={currentId ?? 'new'}
                            currentId={currentId}
                            setCurrentId={setCurrentId}
                            onCreated={handleCreated}
                        />
                    </Box>

                    <Posts setCurrentId={setCurrentId} onRetry={load} onDeleted={handleDeleted} />

                    {!isLoading && !error && numberOfPages > 1 && (
                        <Box sx={{ gridColumn: '1 / -1' }}>
                            <Paper elevation={6} sx={{ borderRadius: 4 }}>
                                <Paginate page={currentPage} numberOfPages={numberOfPages} />
                            </Paper>
                        </Box>
                    )}
                </Box>
            </Container>
        </Grow>
    )
}

export default Home
