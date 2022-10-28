import VRM from '@app/assets/vrm.svg';
import Metaverses from '@app/assets/metaverses.svg';
import WebXR from '@app/assets/webxr.svg';
import Modeling from '@app/assets/modeling.svg';
import Configurators from '@app/assets/configurators.svg';
import Customizers from '@app/assets/customizers.svg';
import * as Yup from 'yup';

export enum EStatus {
  success = 'success',
  errorRetry = 'errorRetry',
  errorReload = 'errorReload',
}

interface PreviewType {
  image: string;
  title: string;
  subtitle: string;
}

export const previewInformation: Array<PreviewType> = [
  {
    image: VRM.src,
    title: 'VRM Models',
    subtitle: 'Cool models for your virtual worlds',
  },
  {
    image: Metaverses.src,
    title: 'Metaverses',
    subtitle: 'What do you think about this?',
  },
  {
    image: WebXR.src,
    title: 'WebXR',
    subtitle: 'Extended Reality technologies',
  },
  {
    image: Modeling.src,
    title: '3D modeling',
    subtitle: 'Extended Reality technologies',
  },
  {
    image: Configurators.src,
    title: '3D configurators',
    subtitle: 'Extended Reality technologies',
  },
  {
    image: Customizers.src,
    title: '3D customizers',
    subtitle: 'Extended Reality technologies',
  },
];

export const schema = Yup.object().shape({
  name: Yup.string().required('Name is required')
    .min(2, 'Must be at least 2 characters long')
    .max(20, 'Must be max 20 characters long')
    .matches(/^[A-z\s-]+$/gi, 'Incorrect name format'),
  phone: Yup.string()
    .required('Phone is required')
    .matches(/^[\d\s()-]+$/, 'Incorrect phone format'),
  email: Yup.string().required('Email is required').email('Email is incorrect'),
});
