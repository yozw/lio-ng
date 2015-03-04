app.factory('examples', function () {
  return [
    {name: 'Home', url: 'model://default.mod'},
    {name: 'From the book', subItems: [
      {name: 'Dovetail', url: 'model://book/dovetail.mod'},
      {name: 'Diet problem', url: 'model://book/diet.mod'},
      {name: 'Knapsack problem', url: 'model://book/knapsack.mod'},
      {name: 'Portfolio optimization', url: 'model://book/portfolio.mod'},
      {name: 'Machine scheduling problem', url: 'model://book/scheduling.mod'},
      {name: 'Decentralization problem', url: 'model://book/decentral.mod'}
    ]},
    {name: 'Two-dimensional models', subItems: [
      {name: 'Dovetail', url: 'model://book/dovetail.mod'},
      {name: 'Circle', url: 'model://circle.mod'}
    ]},
    {name: 'Scheduling', subItems: [
      {name: 'Knight\'s tour', url: 'model://winglpk/knights.mod'},
      {name: 'Personnel assignment problem', url: 'model://winglpk/personnel.mod'},
      {name: 'Simple single unit dispatch', url: 'model://glpk/dispatch.mod'}
    ]},
    {name: 'Financial', subItems: [
      {name: 'Portfolio optimization using mean absolute deviation', url: 'model://glpk/PortfolioMAD.mod'}
    ]},
    {name: 'A puzzle', url: 'model://puzzle.mod'}
  ];
});
