import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

export class FileUploadUtil {
  static getMulterOptions() {
    return {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const filename = `${uuidv4()}-${file.originalname}`;
          callback(null, filename);
        },
      }),
    };
  }
}
