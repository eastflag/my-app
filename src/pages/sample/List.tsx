import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useStore } from '../../contexts/StoreProvider';
import { Typography, Box, Button } from '@mui/material';
import { Post } from '../../services/sample/model/PostModel';
// import { Post } from '../../stores/sample/PostListStore';

const List = observer(() => {
  const { postListStore } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  // initial fetch
  useEffect(() => {
    postListStore.fetchApi();
  }, [location.key]);

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Mobx List - ProductList
      </Typography>
      <Typography variant="h4" gutterBottom>
        Post : {postListStore.getPostCount}
      </Typography>
      {postListStore.loading && (
        <Typography variant="h1" gutterBottom>
          Loading.....
        </Typography>
      )}

      {postListStore.error && <div>JSON.stringify(postListStore.error)</div>}

      {postListStore.postList?.map((item: Post) => {
        return (
          <div key={item.id}>
            <Button
              variant="text"
              onClick={() => {
                navigate('/sample/list/' + item.id, { state: { from: 'List' } });
              }}
            >
              CLICK
            </Button>
            {'ID: ' + item.id}
            {' / UserID :' + item.userId}
            {' / Title :' + item.title}
          </div>
        );
      })}
      <Button
        variant="contained"
        onClick={() => {
          postListStore.fetchApi();
        }}
      >
        FETCH
      </Button>
    </Box>
  );
});

export default List;
