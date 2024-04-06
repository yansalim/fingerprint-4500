import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  FingerprintReader,
  SampleFormat,
  DeviceConnected,
  DeviceDisconnected,
  SamplesAcquired,
  AcquisitionStarted,
  AcquisitionStopped
} from "@digitalpersona/devices"


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private reader!: FingerprintReader;

  private onDeviceConnected = (e: DeviceConnected) => { console.log(e) }
  private onDeviceDisconnected = (e: DeviceDisconnected) => { console.log(e) }

  private onAcquisitionStarted = (e: AcquisitionStarted) => { console.log(e) }
  private onAcquisitionStopped = (e: AcquisitionStopped) => { console.log(e) }

  private onSamplesAcquired = (e: SamplesAcquired) => {
    this.samples = e
    this.showFingerPrint()
  }

  ngOnInit(): void {
    this.reader = new FingerprintReader()
    this.reader.on("DeviceConnected", this.onDeviceConnected)
    this.reader.on("DeviceDisconnected", this.onDeviceDisconnected)
    this.reader.on("AcquisitionStarted", this.onAcquisitionStarted)
    this.reader.on("AcquisitionStopped", this.onAcquisitionStopped)
    this.reader.on("SamplesAcquired", this.onSamplesAcquired)
  }

  ngOnDestroy(): void {
    this.reader.off()
  }

  public fingerprintImage!: string
  public availableDevices!: string[]
  public samples!: any

  async listDevices() {
    this.availableDevices = await this.reader.enumerateDevices()
  }

  async startFingerPrint() {
    await this.reader.startAcquisition(SampleFormat.PngImage)
  }

  async showFingerPrint() {
    const base64 = this.samples.samples[0].replaceAll("\"", "").replaceAll("_", "/").replaceAll("-", "+")

    this.fingerprintImage = base64
  }
}
