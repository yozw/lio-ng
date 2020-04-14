app.factory('examples', function () {
  const root = 'https://raw.githubusercontent.com/yozw/lio-files/master';

  function url(path) {
    return root + '/' + path;
  }

  return [
    {name: 'Home', url: 'builtin:default.mod'},
    {name: 'From the book', subItems: [
      {name: 'Dovetail', url: url('chapter01/dovetail.mod')},
      {name: 'Diet problem', url: url('chapter01/diet.mod')},
      {name: 'Portfolio optimization', url: url('chapter01/portfolio.mod')},
      {name: 'Data envelopment analysis', url: url('chapter01/dea.mod')},
      {name: 'Salmonnose', url: url('chapter04/salmonnose.mod')},
      {name: 'Knapsack problem', url: url('chapter07/knapsack.mod')},
      {name: 'Machine scheduling problem', url: url('chapter07/scheduling.mod')},
      {name: 'Decentralization problem', url: url('chapter07/decentral.mod')},
      {name: 'Project scheduling problem', url: url('chapter08/projectscheduling.mod')},
      {name: 'Irrigation reservoir design', url: url('chapter10/reservoir.mod')},
      {name: 'Document classification', url: url('chapter11/classification.mod')},
      {name: 'Product planning model PP1', url: url('chapter12/PP1.mod')},
      {name: 'Product planning model PP2', url: url('chapter12/PP2.mod')},
      {name: 'Product planning model PP3', url: url('chapter12/PP3.mod')},
      {name: 'Product planning model PP4', url: url('chapter12/PP4.mod')},
      {name: 'Product planning model PP5', url: url('chapter12/PP5.mod')},
      {name: 'Coffee machine production model 1', url: url('chapter13/coffee1.mod')},
      {name: 'Coffee machine production model 2', url: url('chapter13/coffee2.mod')},
      {name: 'Coffee machine production model 3', url: url('chapter13/coffee3.mod')},
      {name: 'Conflicting objectives model O1', url: url('chapter14/conflobj-O1.mod')},
      {name: 'Conflicting objectives model O2', url: url('chapter14/conflobj-O2.mod')},
      {name: 'Conflicting objectives model O3', url: url('chapter14/conflobj-O3.mod')},
      {name: 'Conflicting objectives model O4', url: url('chapter14/conflobj-O4.mod')},
      {name: 'Conflicting objectives model O5', url: url('chapter14/conflobj-O5.mod')},
      {name: 'Coalition formation and profit distribution', url: url('chapter15/coalition.mod')},
      {name: 'The catering service problem', url: url('chapter18/napkin.mod')},
    ]},
    {name: 'Two-dimensional models', subItems: [
      {name: 'Dovetail', url: url('chapter01/dovetail.mod'},
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
