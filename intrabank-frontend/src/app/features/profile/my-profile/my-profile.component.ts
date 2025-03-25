import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ProfileService } from '../../../core/service/profile/profile.service';
import { User } from '../../../shared/models/user.model';
import { Role } from '../../../shared/models/role.model';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent implements OnInit {
  userProfile: User | null = null;
  isEditing = false;
  isLoading = false;
  error: string | null = null;
  updateSuccess = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoading = true;
    this.error = null;
    
    this.profileService.getCurrentUser()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (user) => {
          this.userProfile = user;
        },
        error: (err) => {
          this.error = 'Failed to load profile data. Please try again.';
          console.error('Error loading profile:', err);
        }
      });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.updateSuccess = false;
    this.error = null;
  }

  saveProfile() {
    if (!this.userProfile) return;
    
    // Vérifier si les champs requis sont remplis
    if (!this.userProfile.firstName || 
        !this.userProfile.lastName || 
        !this.userProfile.phone || 
        !this.userProfile.address) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.updateSuccess = false;

  

    this.profileService.updateUserProfile(this.userProfile)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (updatedUser) => {
          this.userProfile = updatedUser;
          this.isEditing = false;
          this.updateSuccess = true;
        },
        error: (err) => {
          this.error = 'Failed to update profile. Please try again.';
          console.error('Error updating profile:', err);
        }
      });
  }
}
