# Firebase: que devuelve en las lecturas publicas

Este archivo explica que devuelve Firebase Realtime Database en este proyecto cuando haces lecturas desde la app, segun las reglas actuales en [data/database.rules.json](data/database.rules.json).

La idea es dejar claro:

- que rutas son publicas
- que rutas no son publicas
- como responde Firebase cuando si hay datos
- como responde Firebase cuando no hay datos
- como responde Firebase cuando la lectura no esta permitida
- ejemplos reales de la forma en que llegan los datos

## 1. Rutas publicas y privadas

Segun las reglas actuales:

### Lectura publica

- `perfil`
- `tour`
- `rifa`

### Lectura no publica

- `agenda`
- `tourAgenda`
- `rifaCompra`

Importante:

- Firebase no filtra campos automaticamente.
- Si una ruta tiene `.read: true`, cualquier campo hijo guardado dentro de esa ruta tambien puede leerse.
- En este proyecto eso significa que si guardas un campo dentro de `perfil/$uid`, ese campo sale completo al leer `perfil/$uid`.

Ejemplo real:

- `perfil` es publico.
- Si dentro del perfil guardas `email`, entonces `email` tambien se devuelve en una lectura publica.

Si quieres que solo algunos campos sean publicos, no basta con "no usarlos en la UI". Hay que mover los campos privados a otra ruta protegida o cambiar las reglas.

## 2. Como devuelve Firebase los datos en la app

En este proyecto se usa el SDK web de Firebase con Realtime Database, por ejemplo desde [src/auth/firebaseConfig.js](src/auth/firebaseConfig.js).

Normalmente la lectura se hace con `get(ref(...))` o con `get(query(...))`.

Firebase no devuelve directamente el objeto final. Devuelve un `DataSnapshot`.

Lo normal es usar:

- `snapshot.exists()` para saber si hay datos
- `snapshot.val()` para obtener el contenido

## 3. Casos de respuesta

### Caso A: la ruta existe y tiene datos

`snapshot.exists()` devuelve `true`.

`snapshot.val()` devuelve el objeto, valor o mapa guardado en esa ruta.

Ejemplo:

```js
import { get, ref } from 'firebase/database';
import { db } from '../src/auth/firebaseConfig.js';

const snapshot = await get(ref(db, 'perfil'));

console.log(snapshot.exists()); // true
console.log(snapshot.val());
```

Salida esperada aproximada:

```js
{
  nzOpA9C7EbX30cnGCQBzPAHkAto2: {
    nombre_completo: 'Frank Garash',
    nombre_usuario: 'frankgarash',
    descripcion: 'Desarrollador apasionado por crear soluciones tecnológicas y organizar tours de aventura en Guatemala.',
    foto_perfil: 'https://lh3.googleusercontent.com/a/ACg8ocKFo1f-00UYJJ156DY-Z596PC7Pz4eUFGmNneBjcjKIE5Yua-2NdA=s96-c',
    email: 'frankgarash@gmail.com',
    rol: 'user',
    perfil_activo: true,
    disponible: true,
    disponible_hoy_en: 'Cobán',
    ubicaciones: {
      u1: 'Guatemala',
      u2: 'Cobán'
    },
    servicios: {
      s1: 'Compañía',
      s2: 'Casa'
    },
    fotos: {
      f1: {
        url: 'https://images.pexels.com/...',
        titulo: 'En la playa',
        fecha: '2026-04-03'
      }
    }
  }
}
```

## 4. Que forma tienen los datos segun el tipo de lectura

### 4.1 Leer toda la coleccion publica `perfil`

Codigo:

```js
const snapshot = await get(ref(db, 'perfil'));
const data = snapshot.val();
```

Lo que devuelve `snapshot.val()`:

```js
{
  UID_1: { ...datosDelPerfil1 },
  UID_2: { ...datosDelPerfil2 },
  UID_3: { ...datosDelPerfil3 }
}
```

O sea:

- devuelve un objeto
- cada clave es el `uid`
- cada valor es el perfil completo guardado en esa ruta

### 4.2 Leer un perfil especifico `perfil/$uid`

Codigo:

```js
const snapshot = await get(ref(db, 'perfil/nzOpA9C7EbX30cnGCQBzPAHkAto2'));
const data = snapshot.val();
```

Lo que devuelve `snapshot.val()`:

```js
{
  nombre_completo: 'Frank Garash',
  nombre_usuario: 'frankgarash',
  descripcion: 'Desarrollador apasionado por crear soluciones tecnológicas y organizar tours de aventura en Guatemala.',
  foto_perfil: 'https://lh3.googleusercontent.com/a/ACg8ocKFo1f-00UYJJ156DY-Z596PC7Pz4eUFGmNneBjcjKIE5Yua-2NdA=s96-c',
  email: 'frankgarash@gmail.com',
  rol: 'user',
  perfil_activo: true,
  disponible: true,
  disponible_hoy_en: 'Cobán',
  ubicaciones: {
    u1: 'Guatemala',
    u2: 'Cobán'
  },
  servicios: {
    s1: 'Compañía',
    s2: 'Casa'
  },
  fotos: {
    f1: {
      url: 'https://images.pexels.com/...',
      titulo: 'En la playa',
      fecha: '2026-04-03'
    }
  }
}
```

O sea:

- ya no devuelve un mapa por `uid`
- devuelve directamente el objeto del perfil

### 4.3 Buscar por `nombre_usuario` con `query`

Este caso es importante porque la app publica lo hace asi en [src/public-profile/PublicProfilePage.jsx](src/public-profile/PublicProfilePage.jsx).

Codigo:

```js
import { equalTo, get, orderByChild, query, ref } from 'firebase/database';

const perfilesRef = ref(db, 'perfil');
const profileQuery = query(perfilesRef, orderByChild('nombre_usuario'), equalTo('frankgarash'));
const snapshot = await get(profileQuery);

console.log(snapshot.exists());
console.log(snapshot.val());
```

Lo que devuelve `snapshot.val()` si encuentra coincidencia:

```js
{
  nzOpA9C7EbX30cnGCQBzPAHkAto2: {
    nombre_completo: 'Frank Garash',
    nombre_usuario: 'frankgarash',
    descripcion: 'Desarrollador apasionado por crear soluciones tecnológicas y organizar tours de aventura en Guatemala.',
    foto_perfil: 'https://lh3.googleusercontent.com/a/ACg8ocKFo1f-00UYJJ156DY-Z596PC7Pz4eUFGmNneBjcjKIE5Yua-2NdA=s96-c',
    email: 'frankgarash@gmail.com',
    rol: 'user',
    perfil_activo: true,
    disponible: true,
    disponible_hoy_en: 'Cobán',
    ubicaciones: {
      u1: 'Guatemala',
      u2: 'Cobán'
    },
    servicios: {
      s1: 'Compañía',
      s2: 'Casa'
    },
    fotos: {
      f1: {
        url: 'https://images.pexels.com/...',
        titulo: 'En la playa',
        fecha: '2026-04-03'
      }
    }
  }
}
```

O sea:

- aunque la consulta encuentre solo un perfil
- Firebase devuelve un objeto con claves
- no devuelve automaticamente solo el primer resultado

Por eso en la app se hace esto:

```js
const firstMatch = Object.values(snapshot.val() || {})[0] || null;
```

### 4.4 Leer toda la coleccion publica `tour`

Codigo:

```js
const snapshot = await get(ref(db, 'tour'));
const data = snapshot.val();
```

Lo que devuelve `snapshot.val()`:

```js
{
  '-OpKrpyCgEitxvxcwC7M': {
    activo: true,
    creado_por_uid: 'nzOpA9C7EbX30cnGCQBzPAHkAto2',
    titulo: 'xela',
    detalles: 'hoteles a domicilio',
    fecha: '2026-05-13',
    disponibles: {
      h0600: '06:00',
      h1000: '10:00'
    }
  }
}
```

### 4.5 Leer un tour especifico `tour/$tour_id`

Codigo:

```js
const snapshot = await get(ref(db, 'tour/-OpKrpyCgEitxvxcwC7M'));
const data = snapshot.val();
```

Lo que devuelve `snapshot.val()`:

```js
{
  activo: true,
  creado_por_uid: 'nzOpA9C7EbX30cnGCQBzPAHkAto2',
  titulo: 'xela',
  detalles: 'hoteles a domicilio',
  fecha: '2026-05-13',
  disponibles: {
    h0600: '06:00',
    h1000: '10:00'
  }
}
```

### 4.6 Leer toda la coleccion publica `rifa`

Codigo:

```js
const snapshot = await get(ref(db, 'rifa'));
const data = snapshot.val();
```

Lo que devuelve `snapshot.val()`:

```js
{
  RIFA_ID_001: {
    titulo: 'Gran Sorteo Pro-Tour',
    detalles: 'Ayúdanos a equipar nuestras próximas rutas.',
    fecha_sorteo: '2026-12-24',
    hora_sorteo: '20:00',
    terminos_condiciones: '1. El premio se entrega al portador. 2. Sorteo en vivo. 3. Pago previo requerido.',
    premios: {
      p1: '1er Lugar: Tour Semuc Champey',
      p2: '2do Lugar: Mochila técnica'
    },
    ganadores: {
      g1: '1er Lugar: Pendiente',
      g2: '2do Lugar: Pendiente'
    },
    precio: 25,
    total_numeros: 100,
    creado_por_uid: 'nzOpA9C7EbX30cnGCQBzPAHkAto2',
    numeros_ocupados: {
      n05: true,
      n88: true
    }
  }
}
```

## 5. Cuando no hay datos

Si la ruta no existe, o la consulta no encuentra coincidencias:

- `snapshot.exists()` devuelve `false`
- `snapshot.val()` devuelve `null`

Ejemplo:

```js
const snapshot = await get(ref(db, 'perfil/uid-que-no-existe'));

console.log(snapshot.exists()); // false
console.log(snapshot.val()); // null
```

Ejemplo con query sin coincidencias:

```js
const profileQuery = query(ref(db, 'perfil'), orderByChild('nombre_usuario'), equalTo('usuario-inexistente'));
const snapshot = await get(profileQuery);

console.log(snapshot.exists()); // false
console.log(snapshot.val()); // null
```

## 6. Cuando la lectura no esta permitida

Si intentas leer una ruta privada sin permisos, por ejemplo `agenda`, `tourAgenda` o `rifaCompra`, la lectura no devuelve `null` como si no existiera.

Normalmente la promesa falla con error de permisos.

Ejemplo:

```js
try {
  const snapshot = await get(ref(db, 'agenda'));
  console.log(snapshot.val());
} catch (error) {
  console.error(error.code, error.message);
}
```

Resultado esperado:

```js
'PERMISSION_DENIED'
```

Resumen rapido:

- sin datos: `exists() === false` y `val() === null`
- sin permiso: la lectura falla con error
- con datos: `exists() === true` y `val()` trae el contenido

## 7. Que pasa con Storage

Las reglas de Storage permiten lectura publica de los archivos en `media/{userId}/{fileName}`.

Eso significa que:

- una vez tienes la URL publica del archivo, la imagen puede cargarse
- Firebase Storage no devuelve un `DataSnapshot`
- lo comun es obtener una URL y usarla directamente en un `<img>`

Ejemplo de valor publico guardado en Realtime Database dentro del perfil:

```js
{
  foto_perfil: 'https://firebasestorage.googleapis.com/v0/b/...',
  fotos: {
    f1: {
      url: 'https://firebasestorage.googleapis.com/v0/b/...',
      titulo: 'Foto 1',
      fecha: '2026-04-03'
    }
  }
}
```

En ese caso:

- Realtime Database devuelve el string de la URL
- el navegador luego pide la imagen con esa URL

## 8. Ejemplo completo de lectura publica segura

Este ejemplo lee solo rutas publicas y maneja todos los casos importantes:

```js
import { equalTo, get, orderByChild, query, ref } from 'firebase/database';
import { db } from '../src/auth/firebaseConfig.js';

async function cargarPerfilPublico(username) {
  try {
    const perfilesRef = ref(db, 'perfil');
    const consulta = query(perfilesRef, orderByChild('nombre_usuario'), equalTo(username));
    const snapshot = await get(consulta);

    if (!snapshot.exists()) {
      return {
        ok: true,
        found: false,
        data: null,
      };
    }

    const raw = snapshot.val();
    const profile = Object.values(raw || {})[0] || null;

    return {
      ok: true,
      found: Boolean(profile),
      data: profile,
    };
  } catch (error) {
    return {
      ok: false,
      found: false,
      data: null,
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }
}
```

Posibles resultados:

### Resultado con perfil encontrado

```js
{
  ok: true,
  found: true,
  data: {
    nombre_completo: 'Frank Garash',
    nombre_usuario: 'frankgarash',
    descripcion: 'Desarrollador apasionado por crear soluciones tecnológicas y organizar tours de aventura en Guatemala.',
    foto_perfil: 'https://...',
    email: 'frankgarash@gmail.com',
    rol: 'user'
  }
}
```

### Resultado sin coincidencias

```js
{
  ok: true,
  found: false,
  data: null
}
```

### Resultado con error de permisos o configuracion

```js
{
  ok: false,
  found: false,
  data: null,
  error: {
    code: 'PERMISSION_DENIED',
    message: 'Permission denied'
  }
}
```

## 9. Resumen final

Con las reglas actuales, Firebase devuelve publicamente datos de:

- `perfil`
- `tour`
- `rifa`

Y los devuelve asi:

- leyendo la coleccion completa: un objeto cuyas claves son ids
- leyendo un nodo exacto: el objeto de ese nodo
- leyendo una query: otro objeto por ids, aunque solo haya una coincidencia
- si no hay datos: `null`
- si no hay permiso: error de permisos

Punto clave de este proyecto:

- todo lo que guardes dentro de una ruta publica sale completo en la lectura publica
- Firebase no oculta campos privados por ti

Si mas adelante quieres separar datos publicos y privados del perfil, la forma correcta es mover lo privado a otra ruta protegida, por ejemplo `perfilPrivado/$uid`.