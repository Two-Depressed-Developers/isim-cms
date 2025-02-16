import {errors} from '@strapi/utils'
const { ApplicationError } = errors;

const validations = {
    // 'test-group' : async (data, documentId) => {
    //     const { member, supervisor } = data;
        
    //     const existingGroup = await strapi.documents('api::test-group.test-group').findOne({
    //         documentId,
    //         populate: {
    //             member: { fields: ['id'] },
    //             supervisor: { fields: ['id'] },
    //         },
    //     });

    //     if (!existingGroup) {
    //         const supervisorId = supervisor.connect?.[0]?.id;
    //         if (supervisorId && !member.connect.some(({ id }) => id === supervisorId)) {
    //             throw new ApplicationError('The supervisor must be a member of the group.');
    //         }
    //         return;
    //     }

    //     const existingMembers = existingGroup.member;
    //     const existingSupervisor = existingGroup.supervisor;

    //     const futureMembers = [
    //         ...existingMembers.filter(({ id }) => !member.disconnect.some(({ id: disconnectId }) => disconnectId === id)),
    //         ...member.connect,
    //     ];

    //     const futureSupervisor = supervisor.connect?.[0] || (supervisor.disconnect?.length === 0 ? existingSupervisor : null);

    //     if (futureSupervisor && !futureMembers.some(({ id }) => id === futureSupervisor.id)) 
    //         throw new ApplicationError('The supervisor must be a member of the group.');
            
    // }
}

const getCollectionNameFromRequestUrl = (reqUrl) => {
  if (reqUrl.includes('::'))
  {
      const after = reqUrl.split('::')[1];
      if (after.includes('.'))
          return after.split('.')[0]
      else
          return null;
  }
  else
      return null;
}

const getCollectionDocumentIdFromRequestUrl = (reqUrl) => {
    if(reqUrl.includes('::')){
        const after = reqUrl.split('::')[1];
        if(after.includes('/')){
            return after.split('/')[1].slice(0, -1);
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export default (config, { strapi })=> {
    return async (ctx, next) => {
      if (ctx.request.method === 'PUT' || ctx.request.method === 'POST')
      {
          if (ctx.request.url.includes('/content-manager/collection-types/api::') || 
          ctx.request.url.includes('/content-manager/single-types/api::'))
          {
              const apiName = getCollectionNameFromRequestUrl(ctx.request.url);
              const documentId = getCollectionDocumentIdFromRequestUrl(ctx.request.url);
              if (Object.keys(validations).includes(apiName))
              {
                  let data = ctx.request.body;
                  await validations[apiName](data, documentId);
              }
          }
      }
      await next();
  }
}