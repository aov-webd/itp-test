import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { MatButtonModule } from '@angular/material/button';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddUserComponent } from './add-user/add-user.component';
import { MatDialogModule } from '@angular/material/dialog';
import { environment } from '../environments/environment';
// import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
// import { provideAuth, getAuth } from '@angular/fire/auth';
// import { provideDatabase, getDatabase } from '@angular/fire/database';
// import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
        AuthComponent,
        AddUserComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatButtonModule,
        FormsModule,
        MatToolbarModule,
        MatInputModule,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatOptionModule,
        MatDialogModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        AngularFireModule.initializeApp(environment.firebase),  // imports firebase/app needed for everything
        AngularFirestoreModule,                                 // imports firebase/firestore, only needed for database features
        AngularFireStorageModule,                               // imports firebase/storage only needed for storage features
        AngularFireDatabaseModule,


        // provideFirebaseApp(() => initializeApp(environment.firebase)),
        // provideAuth(() => getAuth()),
        // provideDatabase(() => getDatabase()),
        // provideFirestore(() => getFirestore()),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
