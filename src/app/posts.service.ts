import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { map } from "rxjs/operators";
import get from "lodash/get";


@Injectable({
  providedIn: "root"
})
export class PostsService {
  constructor(private http: HttpClient) {}
  private baseURL = "https://totroll.gr";
  private per_page = 5;
  
 

  fetchPosts(page: number) {
    return this.http
      .get(`${this.baseURL}/wp-json/wp/v2/posts?_embed&per_page=` + this.per_page + `&page=` + page)
      .pipe(
        map((posts: Array<any>) => posts.map(this.setEmbeddedFeaturedImage))
      );
      
  }
  

  fetchPost(post_id: string) {
    return this.http
      .get(`${this.baseURL}/wp-json/wp/v2/posts/${post_id}?_embed`)
      .pipe(map((post: any) => this.setEmbeddedFeaturedImage(post)));
  }

  /**
   * Makes the featured image parameter easily accessible in a template
   */
  private setEmbeddedFeaturedImage(p) {
    return Object.assign({}, p, {
      featured_image: get(p, "_embedded['wp:featuredmedia'][0].source_url")
    });
  }

  fetchPostCategories() {
    return this.http.get(`${this.baseURL}/wp-json/wp/v2/categories`);
  }

  fetchPostsByCategory(category_id: string) {
    return this.http
      .get(
        `${this.baseURL}/wp-json/wp/v2/posts?_embed&categories=${category_id}`
      )
      .pipe(
        map((posts: Array<any>) => posts.map(this.setEmbeddedFeaturedImage))
      );
  }
}