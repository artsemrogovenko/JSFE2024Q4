import Loader from './loader';
import { IRequestParameters } from '../../types/index';

class AppLoader extends Loader {
    constructor(params: IRequestParameters) {
        super(process.env.API_URL as string, params);
    }
}

export default AppLoader;
