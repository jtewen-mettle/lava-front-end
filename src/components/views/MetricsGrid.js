import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const MetricsGrid = ({ metrics }) => {
  const colors = ['#f9f9f9', '#f0f4f8'];

  return (
    <Grid container spacing={2} justifyContent="flex-start" alignItems="stretch">
      {metrics.map((metric, i) => (
        <Grid item key={i} xs={12} sm={6} md={4} lg={3} display="flex">
          <Card
            style={{
              backgroundColor: colors[i % 2],
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <CardContent style={{ flexGrow: 1 }}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  fontWeight="bold"
                >
                  {metric.label}
                </Typography>
                <Tooltip
                  title={
                    <>
                      <span>{metric.tooltip}</span>
                      <br />
                      <span color="white" style={{ fontStyle: 'italic' }}>
                        {metric.formula}
                      </span>
                    </>
                  }
                  arrow
                >
                  <IconButton size="small">
                    <InfoIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Typography variant="h6" textAlign="left" mt={1}>
                {metric.value}
                {metric.isGood ? (
                  <CheckCircleIcon style={{ color: 'green', marginLeft: '8px' }} />
                ) : (
                  <WarningIcon style={{ color: 'red', marginLeft: '8px' }} />
                )}
              </Typography>
              <Typography
                variant="body2"
                textAlign="left"
                style={{
                  fontStyle: 'italic',
                  color: '#757575',
                  marginTop: '8px',
                }}
              >
                {metric.info}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MetricsGrid;
