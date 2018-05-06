// GET /films & return [{ title, released, studio.name, averageRating }]

Film.aggregate([
    {
        $lookup:
           {
               from: 'studios',
               localField: 'studio',
               foreignField: '_id',
               as: 'studio'
           }
    },
    { $unwind: { path: '$studio' } },
    {
        $lookup:
           {
               from: 'reviews',
               localField: '_id',
               foreignField: 'film',
               as: 'reviews'
           }
    },
    { $unwind: { path: '$reviews', preserveNullAndEmptyArrays: true } },
    { 
        $group:
            {
                _id: '$_id',
                title: { $first: '$title' },
                released: { $first: '$released' },
                studio: { $first: '$studio.name' },
                averageRating: {
                    $avg: {
                        $cond: [{ $gt: ['$reviews', null] }, '$reviews.rating', 0]
                    }
                }
            }
    },
    { $project: { _id: 0, title: 1, released: 1, studio: 1, averageRating: 1 } },
    { $sort: { title: 1 } }
]);

// GET /films/top & return [{ title, released, studio.name, averageRating }] - top 10 sorted by highest rating

Film.aggregate([
    {
        $lookup:
           {
               from: 'studios',
               localField: 'studio',
               foreignField: '_id',
               as: 'studio'
           }
    },
    { $unwind: { path: '$studio' } },
    {
        $lookup:
           {
               from: 'reviews',
               localField: '_id',
               foreignField: 'film',
               as: 'reviews'
           }
    },
    { $unwind: { path: '$reviews', preserveNullAndEmptyArrays: true } },
    {
        $group:
            {
                _id: '$_id',
                title: { $first: '$title' },
                released: { $first: '$released' },
                studio: { $first: '$studio.name' },
                averageRating: {
                    $avg: {
                        $cond: [{ $gt: ['$reviews', null] }, '$reviews.rating', 0]
                    }
                }
            }
    },
    { $project: { _id: 0, title: 1, released: 1, studio: 1, averageRating: 1 } },
    { $sort: { averageRating: -1 } },
    { $limit: 10 }
]);

// GET /actors & return [{ name, movieCount }]

Actor.aggregate([
    {
        $lookup:
       {
           from: 'films',
           localField: '_id',
           foreignField: 'cast.actor',
           as: 'films'
       }
    },
    { $unwind: { path: '$films', preserveNullAndEmptyArrays: true } },
    {
        $group: {
            _id: '$_id',
            name: { $first: '$name' },
            movieCount: {
                $sum: {
                    $cond: [{ $gt: ['$films', null] }, 1, 0]
                }
            }
        }
    },
    { $project: { _id: 0, name: 1, movieCount: 1 } },
    { $sort: { movieCount: -1 } }
]);

// GET /reviewer & return [{ name, company, countOfReviews, averageReview }]

Reviewer.aggregate([
    { $match: { _id: objectId } },
    {
        $lookup:
           {
               from: 'reviews',
               localField: '_id',
               foreignField: 'reviewer',
               as: 'reviews'
           }
    },
    { $unwind: { path: '$reviews', preserveNullAndEmptyArrays: true } },
    {
        $group: {
            _id: '$_id',
            name: { $first: '$name' },
            company: { $first: '$company' },
            countOfReviews: {
                $sum: {
                    $cond: [{ $gt: ['$reviews', null] }, 1, 0]
                }
            },
            averageRating: {
                $avg: {
                    $cond: [{ $gt: ['$reviews', null] }, '$reviews.rating', 0]
                }
            }
        }
    },
    { $project: { _id: 0, name: 1, company: 1, countOfReviews: 1, averageRating: 1 } }
]);