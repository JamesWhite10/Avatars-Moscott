import { SetupLightStrategy } from './Scene/SetupLightStrategy';
import { SetupLightStrategyInterface } from '../../features/Scene/SetupLightStrategyInterface';

export interface MakeEnvironmentFeatureResult {
  setupLightStrategy: SetupLightStrategyInterface;
}

export class FeatureFactory {
  public makeEnvironmentFeature(): MakeEnvironmentFeatureResult {
    return {
      setupLightStrategy: new SetupLightStrategy(),
    };
  }
}
