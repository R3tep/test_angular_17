import { Injectable } from '@angular/core'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'

@Injectable()
export class SvgIconService {
  public customIcons: { iconName: string, fileName: string }[] = [
    {
      iconName: 'group',
      fileName: 'group.svg',
    },
    {
      iconName: 'sort',
      fileName: 'sort.svg',
    },
    {
      iconName: 'arrow',
      fileName: 'arrow.svg',
    },
    {
      iconName: 'search',
      fileName: 'search.svg',
    },
  ]

  constructor(
    protected readonly matIconRegistry: MatIconRegistry,
    protected readonly domSanitizer: DomSanitizer,
  ) {
    this._init()
  }

  protected _init(): void {
    this.customIcons.forEach((icon: { iconName: string, fileName: string }): void => {
      this.matIconRegistry.addSvgIcon(
        icon.iconName,
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          `assets/icons/${
            icon.fileName
          }`
        )
      )
    })
  }
}
