import { Module } from '@nestjs/common';
import { ErrorService } from './errors.service';
import { CustomQueries } from './custom.service';
import { CustomFilesService } from './custom-files.service';

@Module({
  imports: [],
  providers: [ErrorService, CustomQueries, CustomFilesService],
  exports: [ErrorService, CustomQueries],
})
export class CustomQueriesModule {}
