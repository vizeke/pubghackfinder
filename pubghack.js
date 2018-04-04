const distance = require( 'euclidean-distance' );
let telemetry = require( './telemetry.json' );

let players = telemetry
    .filter( x => x._T == 'LogPlayerPosition' || x._T == 'LogVehicleRide' || x._T == 'LogVehicleLeave' )
    .map( x => {
        return {
            name: x.character.name,
            timestamp: x._D,
            location: [ x.character.location.x, x.character.location.y, x.character.location.z ],
            type: x._T,
            inRide: null,
            distance: null
        }
    } )
    .reduce( ( acum, value ) => {
        if ( acum[ value.name ] ) {
            acum[ value.name ].push( value );
        } else {
            acum[ value.name ] = [ value ];
        }
        return acum;
    }, {} );

let inRide = false;
for ( key in players ) {
    let old = null;
    players[ key ].forEach( ( e, i ) => {

        if ( e.type == 'LogVehicleRide' ) {
            inRide = true;
        } else if ( e.type == 'LogVehicleLeave' ) {
            inRide = false;
        }
        e.inRide = inRide;

        if ( old && old.type == 'LogPlayerPosition' ) {
            e.distance = distance( old.location, e.location );
            e.speed = e.distance / ( new Date( e.timestamp ) - new Date( old.timestamp ) ) / 100000 * 3600000;
        }
        old = e;
    } );
}
let maxMaxSpeed = {};
for ( key in players ) {
    players[ key ] = players[ key ].filter( x => x.type == 'LogPlayerPosition' && !x.inRide ).slice( 1 );
    players[ key ].maxSpeed = players[ key ].reduce( ( acum, value ) => acum.speed > value.speed ? acum : value, {} )
    if ( !maxMaxSpeed.speed || players[ key ].maxSpeed.speed > maxMaxSpeed.speed ) {
        maxMaxSpeed = players[ key ].maxSpeed;
    }
}

console.log( JSON.stringify( players[ 'ViZeke' ], null, '    ' ) );

console.log( players[ 'ViZeke' ].reduce( ( acum, value ) => acum.speed > value.speed ? acum : value, {} ) );

console.log( maxMaxSpeed );