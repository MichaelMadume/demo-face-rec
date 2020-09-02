import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HiddenCameraService {

  constructor() { }

  video: HTMLVideoElement;
  localstream: MediaStream;

  async setupCamera() {
    this.stopCamera();

    const node = document.createElement('div');
    node.setAttribute('id', 'parentHiddenCamera');
    node.setAttribute('style', 'display: none');
    node.innerHTML = `
    <video id="hiddenVideo" width="640" height="640" autoplay></video>
    <canvas id="hiddenCameracanvas" width="640" height="640"></canvas>
    `;
    document.body.appendChild(node);
    this.video = document.getElementById('hiddenVideo') as HTMLVideoElement;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      await navigator.mediaDevices.getUserMedia({ video: true }).then(async (stream) => {
        this.localstream = stream;
        this.video.srcObject = stream;
        await this.video.play();
      });
    }
    const canvas = document.getElementById('hiddenCameracanvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    context.translate(640, 0);
    context.scale(-1, 1);
  }

  captureImage() {
    const canvas = document.getElementById('hiddenCameracanvas') as HTMLCanvasElement;
    const video = document.getElementById('hiddenVideo') as HTMLVideoElement;
    const context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, 640, 640);
    return canvas.toDataURL('image/jpeg', 0.92);
  }

  stopCamera() {
    const pictureNode = document.getElementById('parentHiddenCamera');
    if (pictureNode) {
      this.video.pause();
      pictureNode.parentElement.removeChild(pictureNode);
    }
    if (this.localstream) {
      this.localstream.getTracks()[0].stop();
    }
  }
}
