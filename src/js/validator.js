import * as yup from 'yup';

export default (url, sourceList) => {
    const schema = yup.object({
        rssUrl: yup
            .string()
            .url()
            .required()
            .notOneOf(sourceList),
    });

    return schema.validate({ rssUrl: url });
}