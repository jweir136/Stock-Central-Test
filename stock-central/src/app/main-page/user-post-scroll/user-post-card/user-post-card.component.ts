import { Component, Input, OnInit } from '@angular/core';
import { LikeService } from 'src/app/services/like.service';

@Component({
  selector: 'app-user-post-card',
  templateUrl: './user-post-card.component.html',
  styleUrls: ['./user-post-card.component.scss']
})
export class UserPostCardComponent implements OnInit {

  @Input() post: any = '';
  @Input() likedPosts: any = '';

  message: string = '';
  username: string = '';
  showUser = false;
  user = '';
  numOfLikes = 0;
  liked = false;
  postCreationDate = '';
  month = 0;
  day = 0;
  year = 0;
  hour = 0;
  minute = 0;
  second = 0;
  time = 0;
  AMorPM = ''

  constructor(private likeService: LikeService) { }

  ngOnInit(): void {
    for (let i = 0; i < this.likedPosts.length; i++) {
      if (this.likedPosts[i] == this.post.post_id) {
        this.liked = true;
        i = this.likedPosts.length;
      }
    }
    this.postCreationDate = this.post.created_at;
    this.setTime();
    this.message = this.post.message_content
    this.username = this.post.username
    this.user = this.post;
    this.numOfLikes = this.post.num_likes;
    let userJSON = JSON.parse(JSON.stringify(this.user));
    userJSON.user_id = userJSON.fk_user_id;
    this.user = JSON.stringify(userJSON);
  }

  showUserPage() {
    this.showUser = true;
  }

  likePost() {
    this.likeService.likePost(this.post.post_id, <string>localStorage.getItem('userID')).subscribe(res => {
      
    })
    this.liked = true;
    this.numOfLikes++;
  }

  unlikePost() {
    this.likeService.unlikePost(this.post.post_id, <string>localStorage.getItem('userID')).subscribe(res => {
    })
    this.liked = false;
    this.numOfLikes--;
  }

  setTime() {
    this.hour = parseInt((this.postCreationDate.split('T')[1]).split(':')[0]);
    this.minute = parseInt(this.postCreationDate.split(':')[1]);
    this.second = parseInt(this.postCreationDate.split(':')[2]);
    this.day = parseInt((this.postCreationDate.split('-')[2]).split('T')[0]);
    this.month = parseInt(this.postCreationDate.split('-')[1])-1;
    this.year = parseInt(this.postCreationDate.split('-')[0])
    var d = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, 0);
    var timestamp = Math.floor(d.getTime()/1000.0)-18000;
    const date = new Date();
    timestamp = (timestamp) - (date.getTimezoneOffset())*60;
    let calculatedDate = new Date(0);
    calculatedDate.setUTCSeconds(timestamp);
    this.day = calculatedDate.getDate();
    this.month = calculatedDate.getMonth() + 1;
    this.year = calculatedDate.getFullYear();
    this.hour = calculatedDate.getHours();
    this.minute = calculatedDate.getMinutes();
    this.AMorPM += (this.hour >= 12) ? "PM" : "AM";
    if (this.hour > 0 && this.hour <= 12) {
      this.hour = this.hour;
    } else if (this.hour > 12) {
      this.hour = (this.hour - 12);
    } else if (this.hour == 0) {
      this.hour = 12;
    }
  }
}
