import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { InfoCard, InfoCardVariants, MissingAnnotationEmptyState } from '@backstage/core-components';
import { SPINNAKER_ANNOTATION, useSpinnakerApplicationKey } from '../../integration';
import { Alert as AlertUI } from '@material-ui/lab';
import { spinnakerApiRef } from '../../api';
import { useAsync } from 'react-use';
import { Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

type SpinnakerPipelinesStatusCardProps = {
    title?: string;
    variant?: InfoCardVariants;
};

export const SpinnakerPipelinesStatusCard = ({ title, variant }: SpinnakerPipelinesStatusCardProps) => {
    const { entity } = useEntity();
    const query = entity.metadata.annotations?.[SPINNAKER_ANNOTATION];
    
    if (!query) {
        return (
            <MissingAnnotationEmptyState annotation={SPINNAKER_ANNOTATION} />
        );
    }

    const spinnakerApi = useApi(spinnakerApiRef);
    const application = useSpinnakerApplicationKey(entity);
    const { value, loading, error } = useAsync(async () => await spinnakerApi.getApplicationPipelines({limit: 3, query: query, applicationName: application}));
    console.log(value);
    if (loading) {
        return <Progress />;
    } else if (error) {
        return (
            <AlertUI data-testid="error-message" severity="error">
                {error.message}
            </AlertUI>
        );
    }
    return (
        <InfoCard title={title || "Spinnaker Application Deployment Results"} variant={variant || "gridItem"}>
            
        </InfoCard>
    );
};