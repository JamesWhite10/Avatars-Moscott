import { makeAutoObservable } from 'mobx';

export default class EditorStore {
  public isReady = false;

  public progress = 0;

  public showLoadingScreen = true;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public init(): void {
    const id = setInterval(() => {
      if (this.progress === 100) {
        this.setIsReady(true);
        console.log('clear');
        clearInterval(id);
        return;
      }
      this.setProgress(this.progress + 1);
    }, 4000 / 100);
  }

  public setIsReady(isLoading: boolean): void {
    this.isReady = isLoading;
  }

  public setProgress(progress: number): void {
    if (progress < 0) this.progress = 0;
    if (progress >= 100) this.progress = 100;
    this.progress = progress;
  }

  public setShowLoadingScreen(show: boolean): void {
    this.showLoadingScreen = show;
  }

  public hideLoadingScreen(): void {
    if (this.isReady) this.setShowLoadingScreen(false);
  }
}
