db.films.aggregate([
    {
        $lookup:
           {
               from: 'studios',
               localField: 'studio',
               foreignField: '_id',
               as: 'studio'
           }
    },
    {
        $unwind:
        {
            path: '$studio'
        }
    },
    {
        $lookup:
           {
               from: 'reviews',
               localField: '_id',
               foreignField: 'film',
               as: 'reviews'
           }
    },
    {
        $unwind:
        {
            path: '$reviews',
            preserveNullAndEmptyArrays: true
        }
    },
    { $group: { _id: '$_id', title: { $first: '$title' }, released: { $first: '$released' }, studio: { $first: '$studio.name' }, averageRating: { $avg: { $cond: [{ $gt: ['$reviews', null] }, '$reviews.rating', 0] } } } },
    { $project: { _id: 0, title: 1, released: 1, studio: 1, averageRating: 1 } },
    { $sort: { title: 1 } }
]);

db.films.aggregate([
    {
        $lookup:
           {
               from: 'studios',
               localField: 'studio',
               foreignField: '_id',
               as: 'studio'
           }
    },
    {
        $unwind:
        {
            path: '$studio'
        }
    },
    {
        $lookup:
           {
               from: 'reviews',
               localField: '_id',
               foreignField: 'film',
               as: 'reviews'
           }
    },
    {
        $unwind:
        {
            path: '$reviews',
            preserveNullAndEmptyArrays: true
        }
    },
    { $group: { _id: '$_id', title: { $first: '$title' }, released: { $first: '$released' }, studio: { $first: '$studio.name' }, averageRating: { $avg: { $cond: [{ $gt: ['$reviews', null] }, '$reviews.rating', 0] } } } },
    { $project: { _id: 0, title: 1, released: 1, studio: 1, averageRating: 1 } },
    { $sort: { averageRating: -1 } },
    { $limit: 10 }
]);

db.actors.aggregate([
    {
        $lookup:
       {
           from: 'films',
           localField: '_id',
           foreignField: 'cast.actor',
           as: 'films'
       }
    },
    {
        $unwind:
    {
        path: '$films',
        preserveNullAndEmptyArrays: true
    }
    },
    { $group: { _id: '$_id', name: { $first: '$name' }, movieCount: { $sum: { $cond: [{ $gt: ['$films', null] }, 1, 0] } } } },
    { $project: {  
        _id: 0,
        name: 1,
        movieCount: 1
    }
    },
    { $sort: { movieCount: -1 }
    }
]);

db.reviewers.aggregate([
    {
        $match: { _id: ObjectId('5ae2111e2d3d81401f293d64') }
    },
    {
        $lookup:
           {
               from: 'reviews',
               localField: '_id',
               foreignField: 'reviewer',
               as: 'reviews'
           }
    },
    {
        $unwind:
        {
            path: '$reviews',
            preserveNullAndEmptyArrays: true
        }
    },
    { $group: { _id: '$_id', name: { $first: '$name' }, company: { $first: '$company' }, countOfReviews: { $sum: { $cond: [{ $gt: ['$reviews', null] }, 1, 0] } }, averageRating: { $avg: { $cond: [{ $gt: ['$reviews', null] }, '$reviews.rating', 0] } } } },
    { $project: { _id: 0, name: 1, company: 1, countOfReviews: 1, averageRating: 1 } }
]);