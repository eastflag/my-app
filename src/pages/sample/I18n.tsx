import { Link, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useStore } from '../../contexts/StoreProvider';
import { Typography, Box, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

const I18n = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="body" gutterBottom>
        {t('commonTest')}
      </Typography>
      <Typography variant="body" gutterBottom>
        {t('sample:sampleTest')}
      </Typography>
      <Typography variant="body" gutterBottom>
        {t('commonDesc')}
      </Typography>
    </Box>
  );
};

export default I18n;
