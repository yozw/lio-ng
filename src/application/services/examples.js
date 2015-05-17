app.factory('examples', function () {
  return [
    {name: 'Home', url: 'builtin:default.mod'},
    {name: 'From the book', subItems: [
      {name: 'Dovetail', url: 'builtin:book/dovetail.mod'},
      {name: 'Diet problem', url: 'builtin:book/diet.mod'},
      {name: 'Knapsack problem', url: 'builtin:book/knapsack.mod'},
      {name: 'Portfolio optimization', url: 'builtin:book/portfolio.mod'},
      {name: 'Machine scheduling problem', url: 'builtin:book/scheduling.mod'},
      {name: 'Decentralization problem', url: 'builtin:book/decentral.mod'}
    ]},
    {name: 'Two-dimensional models', subItems: [
      {name: 'Dovetail', url: 'builtin:book/dovetail.mod'},
      {name: 'Circle', url: 'builtin:circle.mod'}
    ]},
    {name: 'Scheduling', subItems: [
      {name: 'Knight\'s tour', url: 'builtin:winglpk/knights.mod'},
      {name: 'Parallel machines', url: 'builtin:parallel_machines.mod'},
      {name: 'Personnel assignment problem', url: 'builtin:winglpk/personnel.mod'},
      {name: 'Simple single unit dispatch', url: 'builtin:glpk/dispatch.mod'}
    ]},
    {name: 'Financial', subItems: [
      {name: 'Portfolio optimization using mean absolute deviation', url: 'builtin:glpk/PortfolioMAD.mod'}
    ]},
    {name: 'Puzzles', subItems: [
      {name: 'Number puzzle with inequalities', url: 'builtin:puzzles/inequalities.mod'},
      {name: 'Skyscrapers 2D', url: 'builtin:puzzles/towers2d.mod'},
      {name: 'Skyscrapers 3D', url: 'builtin:puzzles/towers3d.mod'}
    ]}
  ];
});
