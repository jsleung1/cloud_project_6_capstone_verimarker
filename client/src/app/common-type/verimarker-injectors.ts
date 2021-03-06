import { UrlPathConfig } from './url-path-config';
import { InjectionToken, Injector } from '@angular/core';
import { VerimarkerPathConfig } from './verimarker-path-config';

export let URL_PATH_CONFIG = new InjectionToken<UrlPathConfig>('urlPath.config',
    { providedIn: 'root', factory: () => VerimarkerPathConfig }) ;

export const verimarkerInjectors = Injector.create({
    providers: [
        { provide: URL_PATH_CONFIG, useValue: VerimarkerPathConfig }
    ]
});

