import { Link, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useStore } from '../../contexts/StoreProvider';
import { Typography, Box, Divider } from '@mui/material';

const Item = observer(() => {
  const { postItemStore } = useStore();
  const params = useParams();
  const id = Number(params.id);

  // initial fetch & reset when leave
  useEffect(() => {
    postItemStore.fetchApi(id);
    return () => {
      postItemStore.reset();
    };
  }, []);

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Mobx Item - ProductItem
      </Typography>
      <Typography variant="h4" gutterBottom>
        Location(How to get other store`s value) : {postItemStore.getLocation}
      </Typography>
      <Divider />
      {/* {postItemStore.error && <div>JSON.stringify(postItemStore.error)</div>} */}
      {postItemStore.loading && (
        <Typography variant="h1" gutterBottom>
          Loading.....
        </Typography>
      )}
      {postItemStore.id && (
        <>
          <Typography variant="h6" gutterBottom>
            ID : {postItemStore.id}
          </Typography>
          <Typography variant="h6" gutterBottom>
            UserId : {postItemStore.userId}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Title : {postItemStore.title}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Body : {postItemStore.body}
          </Typography>
        </>
      )}
      {/* <Button
        variant="contained"
        onClick={() => {
          postItemStore.fetchApi(id);
        }}
      >
        FETCH
      </Button> */}
      <Link to="/sample/list">Back to List page</Link>
    </Box>
  );
});

export default Item;
