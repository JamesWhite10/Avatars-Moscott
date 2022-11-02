import React, { FC } from 'react';
import { previewInformation } from '@app/containers/Editor/containers/About/config';
import classNames from '../../About.module.scss';

interface PreviewBlockProps {
  titleDeveloping?: string;
  titleCompany?: string;
  titleMission?: string;
  subTitleCompany?: string;
  subTitleMission?: string;
}

const PreviewBlock: FC<PreviewBlockProps> = (props) => {
  const { titleDeveloping, subTitleMission, subTitleCompany, titleMission, titleCompany } = props;
  return (
    <div>
      <div className={classNames.titleDeveloping}>
        {titleDeveloping}
      </div>
      <div className={classNames.developingBlock}>
        {
          previewInformation.map((prev) => (
            <div
              key={prev.title}
              className={classNames.develop}
            >
              <img
                src={prev.image}
                alt={prev.title}
              />
              <div className={classNames.devTitle}>{prev.title}</div>
              <div className={classNames.devSubTitle}>{prev.subtitle}</div>
            </div>
          ))
        }
      </div>
      <div className={classNames.descriptionBlock}>
        <div>
          <div className={classNames.titleCompany}>
            {titleCompany}
          </div>
          <span className={classNames.subTitleCompany}>
            {subTitleCompany}
          </span>
        </div>
        <div>
          <div className={classNames.titleMission}>
            {titleMission}
          </div>
          <span className={classNames.subTitleMission}>
            {subTitleMission}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PreviewBlock;
