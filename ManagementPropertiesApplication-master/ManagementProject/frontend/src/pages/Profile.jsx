import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { OwnProfile } from './profile/OwnProfile'
import { PublicProfile } from './profile/PublicProfile'

/**
 * Main Profile page that routes to either OwnProfile or PublicProfile
 * based on the URL parameters and authentication state.
 */
export default function Profile() {
    const { id }      = useParams();
    const { user }    = useAuth();

    // If no id or id matches current user -> own profile
    const isOwnProfile = !id || String(id) === String(user?.userId);

    if (isOwnProfile) {
        return <OwnProfile authUser={user} />;
    }
    
    return <PublicProfile agentId={id} />;
}