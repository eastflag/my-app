import CommonAccordion from '../../../components/common/CommonAccordion';
import CommonEditor, { isEmptyEditor } from '../../../components/common/CommonEditor';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import { t } from 'i18next';

const useStyles = makeStyles((theme: Theme) => ({
  accordionContainer: {
    width: '952px',
  },
}));

const Accordion = observer(() => {
  const classes = useStyles();
  const localStore = useLocalObservable(() => ({
    content: '',
    setContent(content: string) {
      this.content = content;
    },
  }));

  return (
    <>
      <div className={classes.accordionContainer}>
        <span>Accordion with string</span>
        <CommonAccordion title={'title area1'} subtitle={t('accordion.clickToAdd')} content={'content area'} />
        <CommonAccordion title={'title area2'} subtitle={t('accordion.clickToAdd')} content={'content area'} />
        <CommonAccordion title={'title area3'} subtitle={t('accordion.clickToAdd')} content={'content area'} />
      </div>
      <br />

      <div className={classes.accordionContainer}>
        <span>Accordion with editor</span>
        <CommonAccordion
          title={'title area4'}
          subtitle={'customSubtitle!!!'}
          content={
            <CommonEditor
              value={localStore.content || ''}
              placeholder={'내용을 입력해주세요'}
              onChangeHandler={(content: string) => {
                localStore.setContent(content);
              }}
            />
          }
        />
        <CommonAccordion
          title={'title area5'}
          subtitle={!isEmptyEditor(localStore.content) ? t('accordion.added') : t('accordion.clickToAdd')}
          content={
            <CommonEditor
              value={localStore.content || ''}
              placeholder={'내용을 입력해주세요'}
              onChangeHandler={(content: string) => {
                localStore.setContent(content);
              }}
            />
          }
        />
        <CommonAccordion
          title={'title area6'}
          subtitle={!isEmptyEditor(localStore.content) ? t('accordion.added') : t('accordion.clickToAdd')}
          content={
            <CommonEditor
              value={localStore.content || ''}
              placeholder={'내용을 입력해주세요'}
              onChangeHandler={(content: string) => {
                localStore.setContent(content);
              }}
            />
          }
        />
      </div>
    </>
  );
});

export default Accordion;
