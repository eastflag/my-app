import CommonEditor from '../../../components/common/CommonEditor';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) => ({
  editorContainer: {
    width: '952px',
  },
}));

const Editor = observer(() => {
  const classes = useStyles();
  const localStore = useLocalObservable(() => ({
    content: '',
    setContent(content: string) {
      this.content = content;
    },
  }));

  return (
    <div className={classes.editorContainer}>
      <br />
      <CommonEditor
        value={localStore.content || ''}
        placeholder={'내용을 입력해주세요'}
        onChangeHandler={(content: string) => {
          localStore.setContent(content);
        }}
      />
      <br />
      <CommonEditor
        value={localStore.content || ''}
        placeholder={'내용을 입력해주세요'}
        editorHeight={700}
        onChangeHandler={(content: string) => {
          localStore.setContent(content);
        }}
      />
    </div>
  );
});

export default Editor;
