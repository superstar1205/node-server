import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ServeStaticModuleOptions } from './interfaces/serve-static-options.interface';
import { AbstractLoader } from './loaders/abstract.loader';
import {
  DEFAULT_RENDER_PATH,
  DEFAULT_ROOT_PATH,
  SERVE_STATIC_MODULE_OPTIONS
} from './serve-static.constants';
import { serveStaticProviders } from './serve-static.providers';

@Module({
  providers: [...serveStaticProviders]
})
export class ServeStaticModule implements OnModuleInit {
  constructor(
    @Inject(SERVE_STATIC_MODULE_OPTIONS)
    private readonly ngOptions: ServeStaticModuleOptions[],
    private readonly loader: AbstractLoader,
    private readonly httpAdapterHost: HttpAdapterHost
  ) {}

  public static forRoot(...options: ServeStaticModuleOptions[]): DynamicModule {
    options = options.map<ServeStaticModuleOptions>(option => ({
      rootPath: DEFAULT_ROOT_PATH,
      renderPath: DEFAULT_RENDER_PATH,
      ...option
    }));

    return {
      module: ServeStaticModule,
      providers: [
        {
          provide: SERVE_STATIC_MODULE_OPTIONS,
          useValue: options
        }
      ]
    };
  }

  public async onModuleInit() {
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    this.loader.register(httpAdapter, this.ngOptions);
  }
}
