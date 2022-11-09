import VRM from '../../../../assets/about/vrm.svg';
import Metaverses from '../../../../assets/about/metaverses.svg';
import WebXR from '../../../../assets/about/webxr.svg';
import Modeling from '../../../../assets/about/modeling.svg';
import Configurators from '../../../../assets/about/configurators.svg';
import Customizers from '../../../../assets/about/customizers.svg';
import * as Yup from 'yup';

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
  userName: Yup.string().required('Name is required')
    .min(2, 'Must be at least 2 characters long')
    .max(20, 'Must be max 20 characters long')
    .matches(/^[A-z\s-]+$/gi, 'Incorrect name format'),
  phoneNumber: Yup.string()
    .required('Phone is required')
    .matches(/^[\d\s()-]+$/, 'Incorrect phone format'),
  email: Yup.string().required('Email is required').email('Email is incorrect'),
});
