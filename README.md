# ngx-fast-svg

Fast SVG's for Angular powered by browser native features with best performance practices and DX in mind.

## Why another SVG lib for Angular?

Current implementations of SVG handling in the Browser lacks of awareness of performance.

This library covers next aspects that developers should consider for their projects:

- Image loading performance
- Initial rendering performance and runtime performance
- SVG reusability
- Optimized bundle size
- SSR

## Getting started

### Install

```bash
npm install @push-based/ngx-fast-svg --save
# or
yarn add @push-based/ngx-fast-svg
```

### Setup

**app.module.ts**

```typescript
// ...
import { FastSvgModule } from '@push-based/ngx-fast-svg';

@NgModule({
  declarations: [AppComponent],
  imports: [
    FastSvgModule.forRoot({
      url: (name: string) => `path/to/svg-assets/${name}.svg`,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Usage in the template

```html
<fast-svg [name]="svgName" [size]="svgSize"></fast-svg>
<!-- OR -->
<fast-svg [name]="svgName" [width]="svgWidth" [height]="svgHeight"></fast-svg>
```

### Advanced usage

#### Providing additional options

During setup phase you can provide additional optional settings such as:

```typescript
  defaultSize?: string;
  suspenseSvgString?: string;
  svgLoadStrategy?: Type<SvgLoadStrategy>;
```

`svgLoadStrategy` can be any injectable class that has `load` method that accepts url and returns observable string:

```typescript
@Injectable()
export abstract class SvgLoadStrategy {
  abstract load(url: string): Observable<string>;
}
```

**app.module.ts**

```typescript
// ...
import { FastSvgModule } from '@push-based/ngx-fast-svg';
import { loaderSvg } from './assets';
import { HttpClientFetchStrategy } from './fetch-strategy';

@NgModule({
  declarations: [AppComponent],
  imports: [
    FastSvgModule.forRoot({
      url: (name: string) => `path/to/svg-assets/${name}.svg`,
      defaultSize: '32',
      suspenseSvgString: loaderSvg,
      svgLoadStrategy: HttpClientFetchStrategy
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

#### SSR Usage

You can provide your own SSR loading strategy that can look like this:

```typescript
@Injectable()
export class SvgLoadStrategySsr implements SvgLoadStrategy {
  load(url: string): Observable<string> {
    const iconPath = join(process.cwd(), 'dist', 'app-name', 'browser', url);
    const iconSVG = readFileSync(iconPath, 'utf8');
    return of(iconSVG);
  }
}
```

And then just provide it in you server module.

**app.server.module.ts**

```typescript
@NgModule({
  declarations: [],
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    FastSvgModule.forRoot({
      svgLoadStrategy: SvgLoadStrategySsr,
      url: (name: string) => `assets/svg-icons/${name}.svg`,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
```

## Features

### :sloth: Lazy loading for SVGs

Lazy loading is referring to loading resources only if they are visible on screen. Like lazy loading imgs.
It can be implemented natively over loading attribute or over viewportobserver.
This library supports lazy loading for SVGs using purely browser native features.

- We display an empty SVG at the beginning. Invisible and without dimensions.
- On View init the size is applied even if no svg is loaded to avoid flickering in dimensions.
- A suspense svg is displayed at the same time to reduce visual flickering.
- We use an img element here to leverage the browsers native features:
  - Lazy loading (loading="lazy") to only load the svg that are actually visible
  - The image is styled with display none. this prevents any loading of the resource ever.
    on component bootstrap we decide what we want to do. When we remove display none it performs the browser native behavior.

### :floppy_disk: Caching

We use a DOM caching mechanism to display svg over the 'use' tag and an href attribute.
When the browser loaded the svg resource we trigger the caching mechanism.

`re-fetch -> cache-hit -> get SVG -> cache in DOM`

Cached SVG elements can be reused in multiple places and support different styling.

### :rocket: Optimized for performance

This library leverages best performance practices:

- Component is styled with `content-visiblity: auto;` and `contain: content;`. It makes instances outside of viewport completely excluded from browser style recalculation process.
- Cache is stored in a tag which is not processed by the browser.
- We use native browser `fetch` which is not patched by `zone.js` and is on average 2.5 times faster than fetching over `HTTPClient`.

### 🤖 SSR Support

This library also Supports lazy loading with SSR and http transfer cache.
If SSR load svgs on server => ends up in DOM cache and ships to the client.

## Comparison

> 🖥️ Interactive demo available [here](https://push-based.github.io/ngx-fast-svg).

Here's library comparison with other popular SVG solutions.

| Library          | SSR [1]    | Lazy loading [2]  | Optimized render performance [3] | Size     |
|------------------|------------|-------------------|----------------------------------|----------|
| ngx-fast-svg     | `easy`     | browser natively  | ✔️                               | 1.52 KB  |
| font-awesome     | `hard`     | ❌                | ❌                               | 64.75 KB |
| ant              | `moderate` | ❌                | ❌                               | 24.38 KB |
| material         | `easy`     | ❌                | ❌                               | 16.92 KB |
| angular-svg-icon | `moderate` | ❌                | ❌                               | 1.54 KB  |
| ionic            | `moderate` | viewport observer | ✔️                               | 1.44 KB  |

<!-- | Library          | SSR        | Lazy loading     | Hydration | Reusability of SVG DOM | Optimized render performance | Size     |
| ---------------- | ---------- | ---------------- | --------- | ---------------------- | ---------------------------- | -------- |
| ngx-fast-svg     | `easy`     | browser natively | ✔️        | ✔️                     | ✔️                           | 1.52 KB  |
| font-awesome     | `hard`     | ❌               | ✔️        | ✔️                     | ❌                           | 64.75 KB |
| ant              | `moderate` | ❌               | ✔️        | ✔️                     | ❌                           | 24.38 KB |
| material         | `easy`     | ❌               | ✔️        | ✔️                     | ❌                           | 16.92 KB |
| angular-svg-icon | `moderate` | ❌               | ✔️        | ✔️                     | ❌                           | 1.54 KB  |
| ionic            | `moderate` | viewport observer              | ✔️        | ✔️                     | ✔️                           | 1.443 KB  | -->

**[1] SSR**
Server Side Rendering is working. The depending on how easy it is to set it up we distinguish between `easy`, `moderate`, `hard`.

**[2] Lazy loading**
We refer to lazy loading as on demand loading of SVG files based on their visibility in the viewport.

<!-- **Hydration**
Is the process of taking over the SSR HTML and state of the app on the client side.
This can happen in a destructive way (deleting all present HTML and regenerate it from JS) on in a non-destructive way (reusing the existing DOM).

** Reusability of SVG DOM**
Reusability means that we maintain the content of an SVG, meaning its inner DOM structure `g`, `path` or other tags in one place and reuse them in many different places. -->

**[3] Optimized render performance**
To display (render) SVGs the browser takes time. We can reduce that time by adding a couple of improvements.
