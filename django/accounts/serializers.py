"""Serializers for registration, login, and safe user responses."""
from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Public user representation without password or password hash."""

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'role')
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    """Registration serializer. The client cannot choose a role."""

    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('email', 'username', 'password')

    def validate_email(self, value):
        normalized_email = value.lower().strip()
        if User.objects.filter(email=normalized_email).exists():
            raise serializers.ValidationError('User with this email already exists.')
        return normalized_email

    def validate_username(self, value):
        username = value.strip()
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError('User with this username already exists.')
        return username

    def create(self, validated_data):
        password = validated_data.pop('password')

        # The first account is an administrator to simplify project review.
        role = User.Role.ADMIN if User.objects.count() == 0 else User.Role.USER

        user = User(**validated_data, role=role)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    """Validates credentials and returns an authenticated user."""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs['email'].lower().strip()
        password = attrs['password']
        request = self.context.get('request')

        user = authenticate(request=request, username=email, password=password)
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')

        attrs['user'] = user
        return attrs
