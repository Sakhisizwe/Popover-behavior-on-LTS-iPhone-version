import { Component, OnInit } from '@angular/core';
import { CameraPreview, CameraPreviewOptions } from '@capacitor-community/camera-preview';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isRecording: boolean = false;
  public isAndroid: boolean = false
 
  constructor(
    private readonly androidPermissions: AndroidPermissions
  ) {}
 
  async ngOnInit() {
 
    try {
      if (this.isAndroid) {
        const androidPermissionResponse = await this.androidPermissions.checkPermission(
          this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
        );
        if (!androidPermissionResponse.hasPermission) {
            await this.androidPermissions.requestPermissions([
            this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
            this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
            this.androidPermissions.PERMISSION.RECORD_AUDIO,
            this.androidPermissions.PERMISSION.CAMERA
          ]);
        }
      }
    } catch (e) {
      console.log(`Error requesting external permissions : ${e}`);
    }
    this.startCamera();
  }
 
  async startCamera() {
    const cameraPreviewOpts: CameraPreviewOptions = {
      position: 'rear',
      parent: 'cameraPreview',
      className: 'cameraPreview',
      height: 700
    };
 
    try {
      await CameraPreview.start(cameraPreviewOpts);
    } catch (err) {
      console.error(err);
    }
  }
 
  async startRecording() {

    const cameraPreviewOpts: CameraPreviewOptions = {
      position: 'rear',
      parent: 'cameraPreview',
      className: 'cameraPreview',
      height: 700
    };
    if (!this.isRecording) {
      try {
        // Implement start recording logic here
        CameraPreview.startRecordVideo(cameraPreviewOpts);
        console.log('Recording started...');
        this.isRecording = true;
      } catch (error) {
        console.error('Failed to start recording', error);
      }
    }
  }
 
  async stopRecording() {
    if (this.isRecording) {
      try {
        const result = await CameraPreview.stopRecordVideo();
        CameraPreview.stop();
        console.log('Recording stopped...');
        this.isRecording = false;
      } catch (error) {
        console.error('Failed to stop recording', error);
      }
    }
  }
 
  async stopCamera() {
    try {
      await CameraPreview.stop();
    } catch (error) {
      console.error('Failed to stop the camera', error);
    }
  }
 
  ngOnDestroy() {
    this.stopCamera();
  }
}