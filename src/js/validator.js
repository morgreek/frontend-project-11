import * as yup from 'yup';
import local from './localizations.js';

export default (url, sourceList) => {
    const schema = yup.object({
        rssUrl: yup
            .string()
            .url(local.t('validate.url'))
            .required(local.t('validate.reqiured'))
            .notOneOf(sourceList, local.t('rssEvents.existingUrl')),
    });

    return schema.validate({ rssUrl: url });
}