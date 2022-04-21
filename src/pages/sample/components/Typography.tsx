import { Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

/* eslint-disable */
const TypographyComponents = () => {
  const typographyVariant: (Variant | 'body')[] = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
    'body',
    'body1',
    'body2',
    'overline',
    'caption',
  ];

  return (
    <>
      <div>
        {typographyVariant.map((variant) => (
          <>
            <br />
            <Typography
              // color="textPrimary"
              variant={variant}
            >
              {variant} - Almost before 한글 폰트는
            </Typography>
          </>
        ))}
      </div>
    </>
  );
};

export default TypographyComponents;
