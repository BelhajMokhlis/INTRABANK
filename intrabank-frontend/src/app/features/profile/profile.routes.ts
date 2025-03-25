import type { Routes } from "@angular/router"
import { MyProfileComponent } from "./my-profile/my-profile.component"
export const profile_ROUTES: Routes = [
  { path: "", component: MyProfileComponent },
  { path: "MyProfile", component: MyProfileComponent },
]

